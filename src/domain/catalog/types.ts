/**
 * Modelo de dominio del catálogo.
 * Es independiente de la UI: hoy se alimenta de un archivo estático y mañana
 * puede venir de un CMS o ERP sin tocar los componentes.
 */

export type ProductCategory = "temperatura" | "inyeccion" | "presion";

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Dato destacado que se muestra en tarjetas y en el riel de la ficha. */
export interface KeyFigure {
  value: string;
  label: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface Spec {
  label: string;
  value: string;
}

interface BaseField {
  id: string;
  label: string;
}

/** Campo numérico continuo (p. ej. número de zonas). */
export interface RangeField extends BaseField {
  type: "range";
  min: number;
  max: number;
  defaultValue: number;
  unit?: string;
  /** Rangos sugeridos para responder rápido desde el asistente. */
  presets: string[];
}

/** Campo de opción única (p. ej. amperaje). */
export interface ChoiceField extends BaseField {
  type: "choice";
  options: string[];
  defaultValue: string;
}

export type ConfigField = RangeField | ChoiceField;

export interface Configurator {
  title: string;
  question: string;
  note: string;
  fields: ConfigField[];
  /** Campo que define cuántos módulos dibujar en la vista previa del gabinete. */
  rackFieldId?: string;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  shortName: string;
  name: string;
  tagline: string;
  /** Necesidad del cliente que resuelve, en sus palabras ("¿qué necesita controlar?"). */
  useCase: string;
  description: string;
  images: [ProductImage, ...ProductImage[]];
  keyFigures: KeyFigure[];
  benefits: {
    heading: string;
    highlight: { kicker: string; tags: string[]; image: ProductImage };
    items: [Benefit, Benefit, ...Benefit[]];
  };
  specs: Spec[];
  datasheetUrl: string;
  configurator: Configurator;
}

export type ConfigValues = Record<string, string | number>;
