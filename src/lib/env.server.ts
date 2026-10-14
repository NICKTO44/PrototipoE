import "server-only";
import { z } from "zod";

/**
 * Variables de entorno del servidor, validadas una sola vez.
 * `server-only` hace que el build falle si algún componente de cliente
 * intenta importar este módulo: las claves de IA nunca llegan al bundle.
 */
const optionalSecret = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const serverEnvSchema = z.object({
  /** "anthropic" | "gemini". Si se omite, se usa el que tenga clave (Claude primero). */
  AI_PROVIDER: z.enum(["anthropic", "gemini"]).optional(),
  ANTHROPIC_API_KEY: optionalSecret,
  ANTHROPIC_MODEL: z.string().trim().min(1).default("claude-haiku-5-5"),
  GEMINI_API_KEY: optionalSecret,
  GEMINI_MODEL: z.string().trim().min(1).default("gemini-flash-latest"),
  QUOTE_AGENT_RATE_LIMIT: z.coerce.number().int().positive().max(1000).default(20),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

const read = (key: string) => process.env[key]?.trim() || undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse({
    AI_PROVIDER: read("AI_PROVIDER"),
    ANTHROPIC_API_KEY: read("ANTHROPIC_API_KEY"),
    ANTHROPIC_MODEL: read("ANTHROPIC_MODEL"),
    GEMINI_API_KEY: read("GEMINI_API_KEY"),
    GEMINI_MODEL: read("GEMINI_MODEL"),
    QUOTE_AGENT_RATE_LIMIT: read("QUOTE_AGENT_RATE_LIMIT"),
  });
  if (!parsed.success) {
    // Se informa qué variable falla, nunca su valor.
    const fields = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Variables de entorno inválidas: ${fields}`);
  }
  cached = parsed.data;
  return cached;
}
