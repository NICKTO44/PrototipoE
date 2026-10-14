"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { AgentRequestError, askQuoteAgent } from "./api";
import { MAX_MESSAGES, MAX_MESSAGE_LENGTH, type QuoteDraft } from "./schema";
import { agentReducer, initialAgentState, type AgentState } from "./state";

interface QuoteAgentApi {
  state: AgentState;
  open: (options?: { productSlug?: string; answers?: Record<string, string> }) => void;
  close: () => void;
  choose: (label: string, draft: QuoteDraft) => void;
  send: (text: string) => Promise<void>;
  reset: () => void;
  setSection: (section: string) => void;
  setPageProduct: (slug?: string) => void;
}

const QuoteAgentContext = createContext<QuoteAgentApi | null>(null);

const FAILURE_COPY: Record<string, string> = {
  not_configured: "Por ahora le atiendo con opciones guiadas.",
  rate_limited: "Recibí muchos mensajes seguidos; espere un momento o use las opciones.",
  upstream_error: "No pude procesar su mensaje en este momento.",
  invalid_request: "No pude procesar su mensaje.",
};

/**
 * Un solo asistente para toda la página. Vive en el layout raíz, así que la
 * conversación se conserva al navegar entre el catálogo y las fichas.
 */
export function QuoteAgentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(agentReducer, initialAgentState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const inFlight = useRef<AbortController | null>(null);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
    const current = stateRef.current;
    if (!text || current.pending) return;

    dispatch({ type: "send_start", text });
    if (!current.aiAvailable) {
      dispatch({ type: "send_failure", message: FAILURE_COPY.not_configured! });
      return;
    }

    const history = [...current.messages, { role: "user" as const, content: text }]
      .slice(-MAX_MESSAGES)
      .map(({ role, content }) => ({ role, content: content.slice(0, MAX_MESSAGE_LENGTH) }));

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const res = await askQuoteAgent(
        {
          messages: history,
          draft: current.draft,
          context: { section: current.section, productSlug: current.pageProductSlug },
        },
        controller.signal,
      );
      dispatch({ type: "send_success", reply: res.reply, draft: res.draft });
    } catch (err) {
      if (controller.signal.aborted) return;
      const code = err instanceof AgentRequestError ? err.code : "upstream_error";
      dispatch({
        type: "send_failure",
        message: FAILURE_COPY[code] ?? FAILURE_COPY.upstream_error!,
        disableAi: code === "not_configured",
      });
    }
  }, []);

  // Acciones estables: no cambian de identidad entre renders.
  const actions = useMemo(
    () => ({
      open: (options?: { productSlug?: string; answers?: Record<string, string> }) =>
        dispatch({ type: "open", ...options }),
      close: () => dispatch({ type: "close" }),
      choose: (label: string, draft: QuoteDraft) => dispatch({ type: "choose", label, draft }),
      reset: () => dispatch({ type: "reset" }),
      setSection: (section: string) => dispatch({ type: "set_section", section }),
      setPageProduct: (slug?: string) => dispatch({ type: "set_page_product", slug }),
    }),
    [],
  );

  const api = useMemo<QuoteAgentApi>(() => ({ state, send, ...actions }), [state, send, actions]);

  return <QuoteAgentContext.Provider value={api}>{children}</QuoteAgentContext.Provider>;
}

export function useQuoteAgent(): QuoteAgentApi {
  const ctx = useContext(QuoteAgentContext);
  if (!ctx) throw new Error("useQuoteAgent debe usarse dentro de <QuoteAgentProvider>");
  return ctx;
}
