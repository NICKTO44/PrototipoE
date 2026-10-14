import "server-only";
import { ApiError, GoogleGenAI } from "@google/genai";
import type { AgentModelOutput, ChatMessage } from "../../schema";
import { AgentUpstreamError, describeError, reasonFromStatus } from "../errors";
import { outputJsonSchema, parseModelText, toMinimalSchema } from "../output";

const responseJsonSchema = toMinimalSchema(outputJsonSchema);
let client: GoogleGenAI | undefined;

export async function callGemini(opts: {
  apiKey: string;
  model: string;
  system: string;
  turns: ChatMessage[];
  timeoutMs: number;
}): Promise<AgentModelOutput> {
  client ??= new GoogleGenAI({ apiKey: opts.apiKey });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  try {
    const response = await client.models.generateContent({
      model: opts.model,
      contents: opts.turns.map((t) => ({
        role: t.role === "assistant" ? "model" : "user",
        parts: [{ text: t.content }],
      })),
      config: {
        systemInstruction: opts.system,
        responseMimeType: "application/json",
        responseJsonSchema,
        temperature: 0.3,
        // Holgado: en los modelos con razonamiento, los tokens de "pensamiento" cuentan aquí.
        maxOutputTokens: 4096,
        abortSignal: controller.signal,
      },
    });
    return parseModelText(response.text);
  } catch (error) {
    if (error instanceof AgentUpstreamError) throw error;
    if (controller.signal.aborted) throw new AgentUpstreamError("timeout", describeError(error));
    const status = error instanceof ApiError ? error.status : undefined;
    throw new AgentUpstreamError(reasonFromStatus(status), describeError(error));
  } finally {
    clearTimeout(timer);
  }
}
