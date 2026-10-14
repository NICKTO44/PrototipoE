"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useQuoteAgent } from "../QuoteAgentProvider";

/** Botón que abre el asistente, opcionalmente con producto y configuración precargados. */
export function OpenAgentButton({
  productSlug,
  answers,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
  productSlug?: string;
  answers?: Record<string, string>;
}) {
  const { open } = useQuoteAgent();
  return <Button {...props} onClick={() => open({ productSlug, answers })} />;
}
