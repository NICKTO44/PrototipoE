import { describe, expect, it } from "vitest";
import {
  EMPTY_DRAFT,
  applyFieldAnswer,
  applyProduct,
  buildQuoteMailto,
  getNextStep,
  mergeModelDraft,
} from "./flow";

describe("flujo guiado de cotización", () => {
  it("pide primero el producto", () => {
    const step = getNextStep(EMPTY_DRAFT);
    expect(step.kind).toBe("product");
    if (step.kind === "product") expect(step.options).toHaveLength(4);
  });

  it("recorre los campos del configurador y luego pide el correo", () => {
    let draft = applyProduct(EMPTY_DRAFT, "temperatura-modular");
    expect(getNextStep(draft)).toMatchObject({ kind: "field", field: { id: "zonas" } });
    draft = applyFieldAnswer(draft, "zonas", "7–12");
    expect(getNextStep(draft)).toMatchObject({ kind: "field", field: { id: "amperaje" } });
    draft = applyFieldAnswer(draft, "amperaje", "30 A");
    expect(getNextStep(draft).kind).toBe("contact");
    expect(getNextStep({ ...draft, email: "ana@empresa.com" }).kind).toBe("summary");
  });

  it("al cambiar de producto descarta las respuestas anteriores", () => {
    const draft = applyFieldAnswer(
      applyProduct(EMPTY_DRAFT, "temperatura-modular"),
      "zonas",
      "2–6",
    );
    expect(applyProduct(draft, "presion").answers).toEqual({});
  });

  it("ignora datos del modelo que no existen en el catálogo", () => {
    const merged = mergeModelDraft(EMPTY_DRAFT, {
      productSlug: "producto-inventado",
      answers: [{ fieldId: "zonas", value: "12" }],
      email: "no-es-un-correo",
    });
    expect(merged.productSlug).toBeUndefined();
    expect(merged.answers).toEqual({});
    expect(merged.email).toBeUndefined();
  });

  it("acepta datos válidos del modelo", () => {
    const merged = mergeModelDraft(EMPTY_DRAFT, {
      productSlug: "temperatura-modular",
      answers: [
        { fieldId: "zonas", value: "12" },
        { fieldId: "campo-falso", value: "x" },
      ],
      email: "ana@empresa.com",
    });
    expect(merged.answers).toEqual({ zonas: "12" });
    expect(merged.email).toBe("ana@empresa.com");
  });

  it("genera un mailto con el resumen codificado", () => {
    const href = buildQuoteMailto(
      { productSlug: "presion", answers: { equipo: "Transductor" }, email: "a@b.co" },
      "ventas@euroheaters.mx",
    );
    expect(href.startsWith("mailto:ventas@euroheaters.mx?subject=")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Equipo: Transductor");
  });
});
