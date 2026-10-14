import "server-only";
import { getServerEnv } from "@/lib/env.server";
import { toModelTurns } from "../conversation";
import type { AgentModelOutput, AgentRequest } from "../schema";
import { AgentNotConfiguredError, AgentUpstreamError } from "./errors";
import { buildSystemPrompt } from "./prompt";
import { callAnthropic } from "./providers/anthropic";
import { callGemini } from "./providers/gemini";

const TIMEOUT_MS = 25_000;

/**
 * Punto único de entrada al modelo. El proveedor se elige por configuración:
 * AI_PROVIDER explícito, o automáticamente según la clave disponible (Claude primero).
 */
export async function runQuoteAgent(req: AgentRequest): Promise<AgentModelOutput> {
  const env = getServerEnv();
  const turns = toModelTurns(req.messages);
  if (turns.length === 0) throw new AgentUpstreamError("bad_request", "Sin mensajes del usuario");
  const system = buildSystemPrompt(req);

  const provider =
    env.AI_PROVIDER ??
    (env.ANTHROPIC_API_KEY ? "anthropic" : env.GEMINI_API_KEY ? "gemini" : undefined);

  if (provider === "anthropic" && env.ANTHROPIC_API_KEY) {
    return callAnthropic({
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.ANTHROPIC_MODEL,
      system,
      turns,
      timeoutMs: TIMEOUT_MS,
    });
  }
  if (provider === "gemini" && env.GEMINI_API_KEY) {
    return callGemini({
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL,
      system,
      turns,
      timeoutMs: TIMEOUT_MS,
    });
  }
  throw new AgentNotConfiguredError("No hay proveedor de IA configurado");
}

export { AgentNotConfiguredError, AgentUpstreamError };
