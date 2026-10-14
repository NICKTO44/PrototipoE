import { NextResponse, type NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env.server";
import { createRateLimiter } from "@/lib/rate-limit";
import { mergeModelDraft } from "@/features/quote-agent/flow";
import {
  agentRequestSchema,
  type AgentErrorCode,
  type AgentResponse,
} from "@/features/quote-agent/schema";
import { AgentNotConfiguredError, runQuoteAgent } from "@/features/quote-agent/server/gemini";

const MAX_BODY_BYTES = 32 * 1024;

let limiter: ReturnType<typeof createRateLimiter> | undefined;

function error(code: AgentErrorCode, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: code }, { status, headers });
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

/** Solo se aceptan peticiones del propio sitio (protección básica anti-abuso). */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return error("invalid_request", 403);

  limiter ??= createRateLimiter({ limit: getServerEnv().QUOTE_AGENT_RATE_LIMIT, windowMs: 60_000 });
  const rate = limiter(clientIp(req));
  if (!rate.ok) return error("rate_limited", 429, { "Retry-After": String(rate.retryAfterSec) });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return error("invalid_request", 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return error("invalid_request", 400);
  }
  const parsed = agentRequestSchema.safeParse(json);
  if (!parsed.success) return error("invalid_request", 400);

  try {
    const output = await runQuoteAgent(parsed.data);
    const body: AgentResponse = {
      reply: output.reply,
      handoff: output.handoff,
      // El servidor valida contra el catálogo lo que propone el modelo.
      draft: mergeModelDraft(parsed.data.draft, output),
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof AgentNotConfiguredError) return error("not_configured", 503);
    // Solo se registra el tipo de error: nunca el contenido del usuario.
    console.error("[quote-agent] upstream error:", err instanceof Error ? err.message : "unknown");
    return error("upstream_error", 502);
  }
}
