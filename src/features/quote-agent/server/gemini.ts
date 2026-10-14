import "server-only";
import { ApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getServerEnv } from "@/lib/env.server";
import { agentModelOutputSchema, type AgentModelOutput, type AgentRequest } from "../schema";
import { buildSystemPrompt } from "./prompt";

const TIMEOUT_MS = 25_000;

/**
 * Esquema JSON que Gemini debe respetar, generado desde Zod (una sola fuente de verdad).
 * Se dejan solo las palabras clave básicas que el modo JSON de Gemini admite; las
 * restricciones finas (longitudes, etc.) se validan después con Zod.
 */
const ALLOWED_KEYS = new Set(["type", "properties", "required", "items", "enum", "description"]);

function toGeminiSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(toGeminiSchema);
  if (!node || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    out[key] =
      key === "properties"
        ? Object.fromEntries(
            Object.entries(value as object).map(([k, v]) => [k, toGeminiSchema(v)]),
          )
        : toGeminiSchema(value);
  }
  return out;
}

const responseJsonSchema = toGeminiSchema(z.toJSONSchema(agentModelOutputSchema));

let client: GoogleGenAI | undefined;

function getClient(apiKey: string) {
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export class AgentNotConfiguredError extends Error {}
/** Categoría del fallo: se devuelve al cliente para diagnóstico, sin detalles sensibles. */
export type UpstreamReason =
  | "auth"
  | "quota"
  | "model_not_found"
  | "bad_request"
  | "timeout"
  | "empty_output"
  | "invalid_output"
  | "unknown";

export class AgentUpstreamError extends Error {
  constructor(
    public readonly reason: UpstreamReason,
    message: string,
  ) {
    super(message);
  }
}

function reasonFromStatus(status: number): UpstreamReason {
  if (status === 401 || status === 403) return "auth";
  if (status === 429) return "quota";
  if (status === 404) return "model_not_found";
  if (status === 400) return "bad_request";
  return "unknown";
}

export async function runQuoteAgent(req: AgentRequest): Promise<AgentModelOutput> {
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) throw new AgentNotConfiguredError("GEMINI_API_KEY no configurada");

  const ai = getClient(env.GEMINI_API_KEY);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: req.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: buildSystemPrompt(req),
        responseMimeType: "application/json",
        responseJsonSchema,
        temperature: 0.3,
        // Holgado: en los modelos con razonamiento, los tokens de "pensamiento" cuentan aquí.
        maxOutputTokens: 4096,
        abortSignal: controller.signal,
      },
    });

    const text = (response.text ?? "").trim();
    if (!text) {
      throw new AgentUpstreamError(
        "empty_output",
        `Respuesta vacía (finishReason: ${response.candidates?.[0]?.finishReason ?? "desconocido"})`,
      );
    }
    let json: unknown;
    try {
      // Tolera respuestas envueltas en bloque de código ```json … ```.
      json = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    } catch {
      throw new AgentUpstreamError("invalid_output", "JSON inválido en la respuesta del modelo");
    }
    const parsed = agentModelOutputSchema.safeParse(json);
    if (!parsed.success)
      throw new AgentUpstreamError("invalid_output", "Respuesta del modelo fuera de esquema");
    return parsed.data;
  } catch (error) {
    if (error instanceof AgentUpstreamError) throw error;
    // Mensaje técnico del SDK (código/estado de la API). No incluye datos del usuario.
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : "UnknownError";
    const reason: UpstreamReason =
      error instanceof ApiError
        ? reasonFromStatus(error.status)
        : controller.signal.aborted
          ? "timeout"
          : "unknown";
    throw new AgentUpstreamError(reason, detail.slice(0, 300));
  } finally {
    clearTimeout(timer);
  }
}
