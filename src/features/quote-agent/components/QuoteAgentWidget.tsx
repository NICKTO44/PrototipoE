"use client";

import { Loader2, Mail, MessageSquareText, Phone, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { useFloatingVisible } from "@/hooks/useFloatingVisible";
import { cn } from "@/lib/cn";
import {
  applyFieldAnswer,
  applyProduct,
  buildQuoteMailto,
  getNextStep,
  isValidEmail,
  summarizeDraft,
} from "../flow";
import { useQuoteAgent } from "../QuoteAgentProvider";

export function QuoteAgentWidget() {
  const { state, open, close, choose, send, reset } = useQuoteAgent();
  const { isOpen, messages, draft, pending, section } = state;
  const step = getNextStep(draft);
  const panelId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [text, setText] = useState("");
  const visible = useFloatingVisible() || isOpen;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isOpen, step.kind]);

  // Al abrir, el foco va al campo de texto (una sola vez por apertura).
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
    setText("");
  };

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 sm:right-6 sm:bottom-6",
        !visible && "pointer-events-none translate-y-4 opacity-0",
      )}
      inert={!visible}
    >
      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Asistente de cotización"
          className="flex max-h-[min(640px,calc(100dvh-6.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-[0_30px_60px_-20px_rgba(16,20,23,0.55)]"
        >
          <header className="flex items-center gap-3 border-t-[3px] border-accent bg-ink py-3 pr-2 pl-4 text-night-text">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent">
              <MessageSquareText aria-hidden className="size-5 text-white" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-semibold">Asistente de cotización</span>
              <span className="truncate font-mono text-[11px] text-night-subtle uppercase">
                {state.aiAvailable ? "Automático" : "Modo guiado"} · {section}
              </span>
            </span>
            <button
              type="button"
              onClick={reset}
              aria-label="Nueva cotización"
              className="grid size-11 place-items-center rounded text-night-muted hover:text-white"
            >
              <RotateCcw aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                close();
                launcherRef.current?.focus();
              }}
              aria-label="Cerrar asistente"
              className="grid size-11 place-items-center rounded text-night-muted hover:text-white"
            >
              <X aria-hidden className="size-5" />
            </button>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#f6f7f5] p-4 text-[15px] leading-snug"
          >
            {messages.map((m) => (
              <p
                key={m.id}
                className={cn(
                  "max-w-[88%] px-3 py-2.5 whitespace-pre-line",
                  m.role === "assistant"
                    ? "self-start rounded-[4px_12px_12px_12px] border border-line-soft bg-paper"
                    : "self-end rounded-[12px_4px_12px_12px] bg-ink text-white",
                )}
              >
                {m.content}
              </p>
            ))}
            {pending && (
              <p className="flex items-center gap-2 self-start text-sm text-muted">
                <Loader2 aria-hidden className="size-4 animate-spin" /> Escribiendo…
              </p>
            )}

            {!pending && (step.kind === "product" || step.kind === "field") && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {step.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() =>
                      choose(
                        o.label,
                        step.kind === "product"
                          ? applyProduct(draft, o.value)
                          : applyFieldAnswer(draft, step.field.id, o.value),
                      )
                    }
                    className="min-h-10 rounded-full border-[1.5px] border-ink bg-paper px-3 text-sm font-medium hover:bg-ink hover:text-white"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {!pending && step.kind === "contact" && <ContactForm />}
            {step.kind === "summary" && <QuoteSummary />}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-line-soft p-2.5">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Escriba su mensaje
            </label>
            <input
              id={`${panelId}-input`}
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={800}
              autoComplete="off"
              placeholder="Ej. necesito 12 zonas a 30 A"
              className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-[15px] outline-none focus:border-ink"
            />
            <button
              type="submit"
              disabled={pending || !text.trim()}
              aria-label="Enviar mensaje"
              className="grid size-11 shrink-0 place-items-center rounded-md bg-ink text-white disabled:opacity-50"
            >
              <Send aria-hidden className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Lanzador compacto: solo ícono, con etiqueta al pasar el cursor. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={isOpen ? "Cerrar asistente de cotización" : "Abrir asistente de cotización"}
        className="group relative grid size-14 place-items-center rounded-full border-2 border-white bg-accent text-white shadow-[0_12px_28px_-8px_rgba(16,20,23,0.55)] transition-transform hover:scale-105 hover:bg-accent-hover"
      >
        {isOpen ? (
          <X aria-hidden className="size-6" />
        ) : (
          <MessageSquareText aria-hidden className="size-6" />
        )}
        {!isOpen && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-[calc(100%+10px)] rounded bg-ink px-2.5 py-1 font-mono text-xs whitespace-nowrap text-white uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Asistente de cotización
          </span>
        )}
      </button>
    </div>
  );
}

function ContactForm() {
  const { state, choose } = useQuoteAgent();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const id = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setError(true);
    choose(email.trim(), {
      ...state.draft,
      email: email.trim(),
      company: company.trim() || state.draft.company,
    });
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-2 rounded-lg border border-line-soft bg-paper p-3"
    >
      <label htmlFor={`${id}-email`} className="text-[13px] text-ink-soft">
        Correo para la cotización
      </label>
      <input
        id={`${id}-email`}
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(false);
        }}
        aria-invalid={error}
        aria-describedby={error ? `${id}-err` : undefined}
        placeholder="correo@empresa.com"
        className="min-h-11 rounded-md border-[1.5px] border-line px-3 outline-none focus:border-ink"
      />
      {error && (
        <span id={`${id}-err`} className="text-[13px] text-[#b42318]">
          Escriba un correo válido.
        </span>
      )}
      <label htmlFor={`${id}-company`} className="text-[13px] text-ink-soft">
        Empresa (opcional)
      </label>
      <input
        id={`${id}-company`}
        autoComplete="organization"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="min-h-11 rounded-md border-[1.5px] border-line px-3 outline-none focus:border-ink"
      />
      <button
        type="submit"
        className="mt-1 min-h-11 rounded-md bg-accent font-semibold text-white hover:bg-accent-hover"
      >
        Continuar
      </button>
    </form>
  );
}

function QuoteSummary() {
  const { state } = useQuoteAgent();
  const rows = summarizeDraft(state.draft);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line-soft bg-paper p-3">
      <dl className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between gap-3 border-b border-line-soft py-1.5 last:border-0"
          >
            <dt className="font-mono text-[11px] text-muted uppercase">{r.label}</dt>
            <dd className="text-right text-sm font-semibold">{r.value}</dd>
          </div>
        ))}
      </dl>
      <a
        href={buildQuoteMailto(state.draft, siteConfig.contact.email)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent font-semibold text-white hover:bg-accent-hover"
      >
        <Mail aria-hidden className="size-4" /> Enviar solicitud
      </a>
      <a
        href={`tel:${siteConfig.contact.phone}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line font-semibold hover:border-ink"
      >
        <Phone aria-hidden className="size-4" /> {siteConfig.contact.phoneLabel}
      </a>
      <p className="text-xs text-muted">Se abrirá su correo con la solicitud lista para enviar.</p>
    </div>
  );
}
