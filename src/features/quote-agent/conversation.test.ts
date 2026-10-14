import { describe, expect, it } from "vitest";
import { toModelTurns } from "./conversation";

describe("toModelTurns", () => {
  it("descarta los saludos iniciales y une turnos consecutivos", () => {
    const turns = toModelTurns([
      { role: "assistant", content: "Hola" },
      { role: "assistant", content: "¿Qué necesita?" },
      { role: "user", content: "12 zonas" },
      { role: "user", content: "a 30 A" },
      { role: "assistant", content: "Perfecto" },
      { role: "assistant", content: "¿Correo?" },
      { role: "user", content: "a@b.co" },
    ]);
    expect(turns.map((t) => t.role)).toEqual(["user", "assistant", "user"]);
    expect(turns[0]?.content).toBe("12 zonas\na 30 A");
  });

  it("devuelve vacío si no hay mensajes del usuario", () => {
    expect(toModelTurns([{ role: "assistant", content: "Hola" }])).toEqual([]);
  });
});
