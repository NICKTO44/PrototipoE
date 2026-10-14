import { describe, expect, it } from "vitest";
import { getDefaultConfig, getProductBySlug, getProducts } from "./queries";

describe("integridad del catálogo", () => {
  const products = getProducts();

  it("tiene slugs únicos", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(products.map((p) => [p.slug, p] as const))(
    "%s tiene un configurador coherente",
    (_, p) => {
      expect(p.configurator.fields.length).toBeGreaterThan(0);
      for (const f of p.configurator.fields) {
        if (f.type === "range") {
          expect(f.defaultValue).toBeGreaterThanOrEqual(f.min);
          expect(f.defaultValue).toBeLessThanOrEqual(f.max);
        } else {
          expect(f.options).toContain(f.defaultValue);
        }
      }
      if (p.configurator.rackFieldId) {
        expect(p.configurator.fields.map((f) => f.id)).toContain(p.configurator.rackFieldId);
      }
      expect(Object.keys(getDefaultConfig(p))).toHaveLength(p.configurator.fields.length);
    },
  );

  it("devuelve undefined para un slug inexistente", () => {
    expect(getProductBySlug("no-existe")).toBeUndefined();
  });
});
