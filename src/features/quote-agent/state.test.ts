import { describe, expect, it } from "vitest";
import { agentReducer, initialAgentState } from "./state";

describe("estado del asistente", () => {
  it("al abrir desde una ficha toma el producto de la página", () => {
    const withPage = agentReducer(initialAgentState, { type: "set_page_product", slug: "presion" });
    const opened = agentReducer(withPage, { type: "open" });
    expect(opened.isOpen).toBe(true);
    expect(opened.draft.productSlug).toBe("presion");
    expect(opened.messages[0]?.content).toContain("Transductores y controladores de presión");
  });

  it("al abrir con una configuración salta directo al correo", () => {
    const opened = agentReducer(initialAgentState, {
      type: "open",
      productSlug: "temperatura-modular",
      answers: { zonas: "12", amperaje: "30 A" },
    });
    expect(opened.draft.answers).toEqual({ zonas: "12", amperaje: "30 A" });
    expect(opened.messages.at(-1)?.content).toContain("correo");
  });

  it("si falla la IA vuelve a mostrar la pregunta pendiente", () => {
    const opened = agentReducer(initialAgentState, { type: "open" });
    const sent = agentReducer(opened, { type: "send_start", text: "hola" });
    const failed = agentReducer(sent, {
      type: "send_failure",
      message: "Sin conexión.",
      disableAi: true,
    });
    expect(failed.pending).toBe(false);
    expect(failed.aiAvailable).toBe(false);
    expect(failed.messages.at(-1)?.content).toContain("¿Qué tipo de controlador necesita?");
  });
});
