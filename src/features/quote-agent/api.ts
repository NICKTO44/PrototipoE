import type { AgentErrorCode, AgentRequest, AgentResponse } from "./schema";

export class AgentRequestError extends Error {
  constructor(public readonly code: AgentErrorCode) {
    super(code);
  }
}

/** Cliente del endpoint propio. El navegador nunca habla con Gemini directamente. */
export async function askQuoteAgent(
  payload: AgentRequest,
  signal?: AbortSignal,
): Promise<AgentResponse> {
  const res = await fetch("/api/quote-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: AgentErrorCode };
    throw new AgentRequestError(data.error ?? "upstream_error");
  }
  return (await res.json()) as AgentResponse;
}
