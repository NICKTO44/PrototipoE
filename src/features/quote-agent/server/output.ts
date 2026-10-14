import "server-only";
import { z } from "zod";
import { agentModelOutputSchema, type AgentModelOutput } from "../schema";
import { AgentUpstreamError } from "./errors";

/** Esquema JSON completo de la salida (para proveedores con soporte amplio, p. ej. Claude). */
export const outputJsonSchema = (() => {
  const { $schema: _ignored, ...schema } = z.toJSONSchema(agentModelOutputSchema);
  void _ignored;
  return schema;
})();

/** Versión mínima (type/properties/required/items/enum) para el modo JSON de Gemini. */
const ALLOWED_KEYS = new Set(["type", "properties", "required", "items", "enum", "description"]);

export function toMinimalSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(toMinimalSchema);
  if (!node || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    out[key] =
      key === "properties"
        ? Object.fromEntries(
            Object.entries(value as object).map(([k, v]) => [k, toMinimalSchema(v)]),
          )
        : toMinimalSchema(value);
  }
  return out;
}

/** Valida lo que devuelve el modelo contra el contrato Zod. */
export function parseModelOutput(value: unknown): AgentModelOutput {
  const parsed = agentModelOutputSchema.safeParse(value);
  if (!parsed.success)
    throw new AgentUpstreamError("invalid_output", "Respuesta del modelo fuera de esquema");
  return parsed.data;
}

export function parseModelText(text: string | undefined): AgentModelOutput {
  const clean = (text ?? "").trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  if (!clean) throw new AgentUpstreamError("empty_output", "Respuesta vacía del modelo");
  try {
    return parseModelOutput(JSON.parse(clean));
  } catch (error) {
    if (error instanceof AgentUpstreamError) throw error;
    throw new AgentUpstreamError("invalid_output", "JSON inválido en la respuesta del modelo");
  }
}
