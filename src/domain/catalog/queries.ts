import { PRODUCTS } from "./products";
import type { ConfigValues, Product, ProductCategory } from "./types";

/**
 * Capa de acceso al catálogo. Los componentes nunca leen PRODUCTS directo:
 * así cambiar la fuente (CMS, API) solo afecta a este archivo.
 */

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory | "todos"): Product[] {
  return category === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== slug);
}

export function getProductIndex(slug: string): number {
  return PRODUCTS.findIndex((p) => p.slug === slug);
}

export function getDefaultConfig(product: Product): ConfigValues {
  return Object.fromEntries(product.configurator.fields.map((f) => [f.id, f.defaultValue]));
}

/** Resumen legible de una configuración, en el orden de los campos. */
export function describeConfig(
  product: Product,
  values: ConfigValues,
): { label: string; value: string }[] {
  return product.configurator.fields.map((f) => ({
    label: f.label,
    value: String(values[f.id] ?? f.defaultValue),
  }));
}
