import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getServerEnv } from "@/lib/env.server";
import { agentModelOutputSchema, type AgentModelOutput, type AgentRequest } from "../schema";
import { buildSystemPrompt } from "./prompt";

const TIMEOUT_MS = 15_000;

/** Esquema JSON que Gemini debe respetar (generado desde Zod: una sola fuente de verdad). */
const { $schema: _ignored, ...responseJsonSchema } = z.toJSONSchema(agentModelOutputSchema);
void _ignored;

let client: GoogleGenAI | undefined;

function getClient(apiKey: string) {
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export class AgentNotConfiguredError extends Error {}
export class AgentUpstreamError extends Error {}

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
        `Respuesta vacía (finishReason: ${response.candidates?.[0]?.finishReason ?? "desconocido"})`,
      );
    }
    let json: unknown;
    try {
      // Tolera respuestas envueltas en bloque de código ```json … ```.
      json = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    } catch {
      throw new AgentUpstreamError("JSON inválido en la respuesta del modelo");
    }
    const parsed = agentModelOutputSchema.safeParse(json);
    if (!parsed.success) throw new AgentUpstreamError("Respuesta del modelo fuera de esquema");
    return parsed.data;
  } catch (error) {
    if (error instanceof AgentUpstreamError) throw error;
    // Mensaje técnico del SDK (código/estado de la API). No incluye datos del usuario.
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : "UnknownError";
    throw new AgentUpstreamError(detail.slice(0, 300));
  } finally {
    clearTimeout(timer);
  }
}
