/** Marcas de corte en las esquinas, estilo lámina técnica. */
export function CornerMarks() {
  const base = "pointer-events-none absolute size-[18px] border-ink";
  return (
    <>
      <span aria-hidden className={`${base} top-2.5 left-2.5 border-t-2 border-l-2`} />
      <span aria-hidden className={`${base} top-2.5 right-2.5 border-t-2 border-r-2`} />
      <span aria-hidden className={`${base} bottom-2.5 left-2.5 border-b-2 border-l-2`} />
      <span aria-hidden className={`${base} right-2.5 bottom-2.5 border-r-2 border-b-2`} />
    </>
  );
}
