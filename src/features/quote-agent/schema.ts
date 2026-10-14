import { z } from "zod";

/** Contrato compartido entre el widget (cliente) y la ruta /api/quote-agent. */

export const MAX_MESSAGES = 20;
export const MAX_MESSAGE_LENGTH = 800;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

const shortText = z.string().trim().max(120);

export const quoteDraftSchema = z.object({
  productSlug: z.string().max(60).optional(),
  answers: z.record(z.string().max(40), shortText).default({}),
  contactName: shortText.optional(),
  company: shortText.optional(),
  email: z.email().max(160).optional(),
});
export type QuoteDraft = z.infer<typeof quoteDraftSchema>;

export const agentRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
  draft: quoteDraftSchema,
  context: z
    .object({
      section: z.string().max(60).optional(),
      productSlug: z.string().max(60).optional(),
    })
    .default({}),
});
export type AgentRequest = z.infer<typeof agentRequestSchema>;

/**
 * Lo que Gemini debe devolver (salida estructurada en JSON).
 * Las respuestas por campo van como lista para que el esquema sea simple.
 */
export const agentModelOutputSchema = z.object({
  reply: z.string().min(1).max(1200),
  // Cadena vacía = dato no aportado (más compatible que null en el modo JSON de Gemini).
  productSlug: z.string(),
  answers: z.array(z.object({ fieldId: z.string(), value: z.string() })),
  contactName: z.string(),
  company: z.string(),
  email: z.string(),
  handoff: z.boolean(),
});
export type AgentModelOutput = z.infer<typeof agentModelOutputSchema>;

export interface AgentResponse {
  reply: string;
  draft: QuoteDraft;
  handoff: boolean;
}

export type AgentErrorCode =
  "not_configured" | "rate_limited" | "invalid_request" | "upstream_error";
