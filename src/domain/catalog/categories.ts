import type { ProductCategory } from "./types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  temperatura: "Temperatura",
  inyeccion: "Inyección",
  presion: "Presión",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];
