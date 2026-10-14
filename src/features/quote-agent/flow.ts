import { getProductBySlug, getProducts, type ConfigField, type Product } from "@/domain/catalog";
import type { QuoteDraft } from "./schema";

/**
 * Flujo guiado de cotización: lógica pura, sin React ni red.
 * Funciona aunque la IA no esté disponible y es la base que garantiza que
 * toda conversación termine en una solicitud completa.
 */

export type FlowStep =
  | { kind: "product"; prompt: string; options: { label: string; value: string }[] }
  | {
      kind: "field";
      prompt: string;
      field: ConfigField;
      options: { label: string; value: string }[];
    }
  | { kind: "contact"; prompt: string }
  | { kind: "summary"; prompt: string };

export const EMPTY_DRAFT: QuoteDraft = { answers: {} };

function fieldOptions(field: ConfigField) {
  const values = field.type === "range" ? field.presets : field.options;
  return values.map((v) => ({
    label: field.type === "range" && field.unit ? `${v} ${field.unit}` : v,
    value: v,
  }));
}

function fieldPrompt(product: Product, field: ConfigField, isFirst: boolean): string {
  return isFirst ? product.configurator.question : `${field.label}:`;
}

export function getNextStep(draft: QuoteDraft): FlowStep {
  const product = draft.productSlug ? getProductBySlug(draft.productSlug) : undefined;
  if (!product) {
    return {
      kind: "product",
      prompt: "¿Qué tipo de controlador necesita?",
      options: getProducts().map((p) => ({ label: p.shortName, value: p.slug })),
    };
  }
  const fields = product.configurator.fields;
  const pending = fields.find((f) => !draft.answers[f.id]);
  if (pending) {
    return {
      kind: "field",
      field: pending,
      prompt: fieldPrompt(product, pending, pending.id === fields[0]?.id),
      options: fieldOptions(pending),
    };
  }
  if (!draft.email) {
    return { kind: "contact", prompt: "¿A qué correo le enviamos la cotización?" };
  }
  return { kind: "summary", prompt: "Su solicitud está lista. Revise el resumen y envíela." };
}

export function applyProduct(draft: QuoteDraft, slug: string): QuoteDraft {
  if (!getProductBySlug(slug)) return draft;
  if (draft.productSlug === slug) return draft;
  return { ...draft, productSlug: slug, answers: {} };
}

export function applyFieldAnswer(draft: QuoteDraft, fieldId: string, value: string): QuoteDraft {
  return { ...draft, answers: { ...draft.answers, [fieldId]: value } };
}

/**
 * Integra en el borrador lo que propone el modelo, aceptando solo valores
 * coherentes con el catálogo (nunca confía ciegamente en la IA).
 */
export function mergeModelDraft(
  draft: QuoteDraft,
  proposal: {
    productSlug?: string | null;
    answers?: { fieldId: string; value: string }[];
    contactName?: string | null;
    company?: string | null;
    email?: string | null;
  },
): QuoteDraft {
  let next = draft;
  if (proposal.productSlug) next = applyProduct(next, proposal.productSlug);
  const product = next.productSlug ? getProductBySlug(next.productSlug) : undefined;
  if (product && proposal.answers) {
    const validIds = new Set(product.configurator.fields.map((f) => f.id));
    for (const a of proposal.answers) {
      const value = a.value.trim().slice(0, 120);
      if (validIds.has(a.fieldId) && value) next = applyFieldAnswer(next, a.fieldId, value);
    }
  }
  const clean = (v?: string | null) => (v ? v.trim().slice(0, 120) : undefined);
  const email = clean(proposal.email);
  return {
    ...next,
    contactName: clean(proposal.contactName) ?? next.contactName,
    company: clean(proposal.company) ?? next.company,
    email: email && isValidEmail(email) ? email : next.email,
  };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function summarizeDraft(draft: QuoteDraft): { label: string; value: string }[] {
  const product = draft.productSlug ? getProductBySlug(draft.productSlug) : undefined;
  if (!product) return [];
  const rows = [{ label: "Producto", value: product.name }];
  for (const f of product.configurator.fields) {
    const v = draft.answers[f.id];
    if (v) rows.push({ label: f.label, value: v });
  }
  if (draft.contactName) rows.push({ label: "Contacto", value: draft.contactName });
  if (draft.company) rows.push({ label: "Empresa", value: draft.company });
  if (draft.email) rows.push({ label: "Correo", value: draft.email });
  return rows;
}

/** Solicitud lista para enviar por correo (funciona sin backend). */
export function buildQuoteMailto(draft: QuoteDraft, to: string): string {
  const product = draft.productSlug ? getProductBySlug(draft.productSlug) : undefined;
  const subject = `Solicitud de cotización · ${product?.name ?? "Controladores"}`;
  const body = [
    "Hola, solicito una cotización con la siguiente configuración:",
    "",
    ...summarizeDraft(draft).map((r) => `• ${r.label}: ${r.value}`),
    "",
    "Gracias.",
  ].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
