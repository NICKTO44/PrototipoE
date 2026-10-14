import "server-only";

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

export function reasonFromStatus(status: number | undefined): UpstreamReason {
  if (status === 401 || status === 403) return "auth";
  if (status === 429 || status === 529) return "quota";
  if (status === 404) return "model_not_found";
  if (status === 400) return "bad_request";
  return "unknown";
}

/** Mensaje técnico del SDK (código/estado). Nunca incluye datos del usuario. */
export function describeError(error: unknown): string {
  return (error instanceof Error ? `${error.name}: ${error.message}` : "UnknownError").slice(
    0,
    300,
  );
}
