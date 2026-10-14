import "server-only";
import { z } from "zod";

/**
 * Variables de entorno del servidor, validadas una sola vez.
 * `server-only` hace que el build falle si algún componente de cliente
 * intenta importar este módulo: la clave de Gemini nunca llega al bundle.
 */
const serverEnvSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  GEMINI_MODEL: z.string().trim().min(1).default("gemini-flash-latest"),
  QUOTE_AGENT_RATE_LIMIT: z.coerce.number().int().positive().max(1000).default(20),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || undefined,
    QUOTE_AGENT_RATE_LIMIT: process.env.QUOTE_AGENT_RATE_LIMIT || undefined,
  });
  if (!parsed.success) {
    // Se informa qué variable falla, nunca su valor.
    const fields = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Variables de entorno inválidas: ${fields}`);
  }
  cached = parsed.data;
  return cached;
}
