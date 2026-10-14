"use client";

import { useEffect } from "react";
import { useQuoteAgent } from "../QuoteAgentProvider";

/** Informa al asistente qué producto está en pantalla (o ninguno). */
export function PageProductSync({ slug }: { slug?: string }) {
  const { setPageProduct } = useQuoteAgent();
  useEffect(() => {
    setPageProduct(slug);
    return () => setPageProduct(undefined);
  }, [slug, setPageProduct]);
  return null;
}
