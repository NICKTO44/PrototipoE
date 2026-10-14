import { getProductBySlug } from "@/domain/catalog";
import { EMPTY_DRAFT, getNextStep } from "./flow";
import type { QuoteDraft } from "./schema";

export interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface AgentState {
  isOpen: boolean;
  section: string;
  pageProductSlug?: string;
  messages: UiMessage[];
  draft: QuoteDraft;
  pending: boolean;
  /** Se apaga si el servidor indica que la IA no está configurada. */
  aiAvailable: boolean;
}

export type AgentAction =
  | { type: "open"; productSlug?: string; answers?: Record<string, string> }
  | { type: "close" }
  | { type: "set_section"; section: string }
  | { type: "set_page_product"; slug?: string }
  | { type: "choose"; label: string; draft: QuoteDraft }
  | { type: "send_start"; text: string }
  | { type: "send_success"; reply: string; draft: QuoteDraft }
  | { type: "send_failure"; message: string; disableAi?: boolean }
  | { type: "reset" };

export const initialAgentState: AgentState = {
  isOpen: false,
  section: "Catálogo",
  messages: [],
  draft: EMPTY_DRAFT,
  pending: false,
  aiAvailable: true,
};

let seq = 0;
const msg = (role: UiMessage["role"], content: string): UiMessage => ({
  id: `${Date.now().toString(36)}-${(seq++).toString(36)}`,
  role,
  content,
});

function greeting(draft: QuoteDraft): UiMessage[] {
  const product = draft.productSlug ? getProductBySlug(draft.productSlug) : undefined;
  const hello = product
    ? `Hola, soy el asistente de cotización. Veo que revisa: ${product.name}. Le armo la solicitud en pocos pasos.`
    : "Hola, soy el asistente de cotización de Euroheaters. Elija una opción o escríbame lo que necesita.";
  return [msg("assistant", hello), msg("assistant", getNextStep(draft).prompt)];
}

function openingMessages(draft: QuoteDraft, fromConfigurator: boolean): UiMessage[] {
  if (!fromConfigurator) return greeting(draft);
  const product = draft.productSlug ? getProductBySlug(draft.productSlug) : undefined;
  const config = Object.values(draft.answers).join(" · ");
  return [
    msg(
      "assistant",
      `Hola, soy el asistente de cotización. Ya tengo su configuración de ${product?.shortName ?? "su equipo"}: ${config}.`,
    ),
    msg("assistant", getNextStep(draft).prompt),
  ];
}

export function agentReducer(state: AgentState, action: AgentAction): AgentState {
  switch (action.type) {
    case "open": {
      const productSlug = action.productSlug ?? state.draft.productSlug ?? state.pageProductSlug;
      const changedProduct = productSlug !== state.draft.productSlug;
      const draft: QuoteDraft = {
        ...state.draft,
        productSlug,
        answers: changedProduct
          ? { ...action.answers }
          : { ...state.draft.answers, ...action.answers },
      };
      const startFresh = state.messages.length === 0 || changedProduct || Boolean(action.answers);
      return {
        ...state,
        isOpen: true,
        draft,
        messages: startFresh ? openingMessages(draft, Boolean(action.answers)) : state.messages,
      };
    }
    case "close":
      return { ...state, isOpen: false };
    case "set_section":
      return state.section === action.section ? state : { ...state, section: action.section };
    case "set_page_product":
      return { ...state, pageProductSlug: action.slug };
    case "choose":
      return {
        ...state,
        draft: action.draft,
        messages: [
          ...state.messages,
          msg("user", action.label),
          msg("assistant", getNextStep(action.draft).prompt),
        ],
      };
    case "send_start":
      return { ...state, pending: true, messages: [...state.messages, msg("user", action.text)] };
    case "send_success":
      return {
        ...state,
        pending: false,
        draft: action.draft,
        messages: [...state.messages, msg("assistant", action.reply)],
      };
    case "send_failure":
      return {
        ...state,
        pending: false,
        aiAvailable: action.disableAi ? false : state.aiAvailable,
        messages: [
          ...state.messages,
          msg("assistant", `${action.message} ${getNextStep(state.draft).prompt}`),
        ],
      };
    case "reset": {
      const draft: QuoteDraft = { ...EMPTY_DRAFT, productSlug: state.pageProductSlug };
      return { ...state, draft, pending: false, messages: greeting(draft) };
    }
  }
}
