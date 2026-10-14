import type { Product } from "./types";

/**
 * Fuente de datos del catálogo.
 * Información tomada de las fichas públicas de Euroheaters México
 * (euroheaters.mx › Productos › Controladores). Sin precios: la cotización
 * siempre la confirma un asesor.
 */

const IMG = "/images/products";

export const PRODUCTS: Product[] = [
  {
    slug: "temperatura-modular",
    category: "temperatura",
    shortName: "Temperatura modular",
    name: "Controlador de temperatura modular",
    tagline: "Hot Runner Controller",
    useCase: "Temperatura por zonas",
    description:
      "Control de temperatura para moldes con canales calientes. Cada zona es una tarjeta independiente con autoajuste permanente: potencia suave, diagnóstico preventivo y cambio de módulo en segundos.",
    images: [
      {
        src: `${IMG}/modular-gabinete-6-zonas.jpg`,
        width: 750,
        height: 420,
        alt: "Gabinete controlador de 6 zonas, vista frontal",
      },
      {
        src: `${IMG}/modular-modulos-zona.png`,
        width: 465,
        height: 429,
        alt: "Módulos de control de zona extraíbles",
      },
      {
        src: `${IMG}/modular-gabinetes-tamanos.jpg`,
        width: 200,
        height: 180,
        alt: "Gabinetes en distintos tamaños según el número de zonas",
      },
      {
        src: `${IMG}/modular-touch-screen.jpg`,
        width: 1200,
        height: 1200,
        alt: "Versión Touch Screen System en gabinete vertical",
      },
    ],
    keyFigures: [
      { value: "2–256", label: "Zonas por sistema" },
      { value: "15/30 A", label: "Salida por módulo" },
      { value: "85–260 V", label: "Alimentación AC" },
    ],
    benefits: {
      heading: "Menos paros de línea. Más control del molde.",
      highlight: {
        kicker: "Diseño 100% modular",
        tags: ["Normal", "Manual", "Standby", "Boost"],
        image: {
          src: `${IMG}/modular-modulos-zona.png`,
          width: 465,
          height: 429,
          alt: "Módulos de zona extraíbles",
        },
      },
      items: [
        {
          title: "Cada zona, una tarjeta",
          description:
            "Si una zona falla, se retira su módulo y se reemplaza sin desmontar el gabinete ni detener las demás zonas.",
        },
        {
          title: "Autoajuste permanente",
          description:
            "Sintonía continua con salida por ángulo de fase: la potencia llega suave y exacta, sin picos que dañen resistencias.",
        },
        {
          title: "Monitor del molde",
          description:
            "Diagnóstico preventivo que detecta fallas antes de que detengan la producción.",
        },
        {
          title: "Soft-start",
          description: "Arranque suave que protege las resistencias en moldes nuevos.",
        },
        {
          title: "Mold doctor",
          description: "Localiza y resuelve problemas del molde de forma guiada.",
        },
        {
          title: "Zonas sincronizadas",
          description:
            "Todas las zonas suben al mismo ritmo, con transferencia sin perturbaciones.",
        },
      ],
    },
    specs: [
      { label: "Aplicación", value: "Moldes de inyección con canales calientes" },
      { label: "Zonas", value: "De 2 hasta 256" },
      { label: "Salida por módulo", value: "15 A / 30 A (opcional)" },
      { label: "Alimentación", value: "85–260 VAC, 50/60 Hz" },
      { label: "Potencia máx. (15 A)", value: "3600 W por zona" },
      { label: "Control", value: "Autoajuste + salida por ángulo de fase" },
      { label: "Modos", value: "Normal, Manual, Standby y Boost" },
      { label: "Series", value: "Serie 5, Serie Mundial y Serie 8" },
    ],
    datasheetUrl:
      "https://www.euroheaters.mx/images/PDFS/ficha-tecnica-controladores-de-temperatura-modular-touch-screen-system.pdf",
    configurator: {
      title: "Arme su gabinete",
      question: "¿Cuántas zonas tiene su molde?",
      note: "Más de 48 zonas: el sistema escala hasta 256. Lo armamos a la medida.",
      rackFieldId: "zonas",
      fields: [
        {
          id: "zonas",
          type: "range",
          label: "Número de zonas",
          min: 2,
          max: 48,
          defaultValue: 6,
          presets: ["2–6", "7–12", "13–24", "25–48", "Más de 48"],
        },
        {
          id: "amperaje",
          type: "choice",
          label: "Salida por módulo",
          options: ["15 A", "30 A"],
          defaultValue: "15 A",
        },
      ],
    },
  },
  {
    slug: "temperatura-rack",
    category: "temperatura",
    shortName: "Temperatura en rack",
    name: "Controlador de temperatura en rack",
    tagline: "Pirómetro digital 48 × 96",
    useCase: "Pirómetros en rack",
    description:
      'Pirómetros digitales con microprocesador en formato normalizado de 48 × 96 mm, programables por teclado y montados en gabinete rack de aluminio de 19" para trabajo continuo en planta.',
    images: [
      {
        src: `${IMG}/rack-pirometro-digital.jpg`,
        width: 960,
        height: 960,
        alt: "Pirómetro digital con display de temperatura real y deseada",
      },
    ],
    keyFigures: [
      { value: "48×96 mm", label: "Formato del pirómetro" },
      { value: '19"', label: "Rack de aluminio" },
      { value: "1·4·5·6", label: "Zonas estándar" },
    ],
    benefits: {
      heading: "Robusto, simple y siempre produciendo.",
      highlight: {
        kicker: "Siempre produciendo",
        tags: ["48×96 mm", 'Rack 19"', "Teclado"],
        image: {
          src: `${IMG}/rack-pirometro-digital.jpg`,
          width: 960,
          height: 960,
          alt: "Pirómetro digital",
        },
      },
      items: [
        {
          title: "Respaldo ante falla de termopar",
          description:
            "Si el termopar falla, pasa solo a modo manual con el % de potencia promedio de los últimos minutos. El molde sigue trabajando.",
        },
        {
          title: "Soft-start automático",
          description:
            "Arranque suave que protege las resistencias cada vez que enciende el equipo.",
        },
        {
          title: "Lectura clara",
          description: "Indicación visual simultánea de la temperatura deseada y la real.",
        },
        {
          title: "Control del % de potencia",
          description: "Ajuste directo de la potencia entregada en cada zona.",
        },
        {
          title: "Amperímetro incluido",
          description: "Verifique el consumo de cada resistencia sin instrumentos extra.",
        },
        { title: "Entrega inmediata", description: "Con garantía y asesoramiento técnico." },
      ],
    },
    specs: [
      { label: "Tipo", value: "Pirómetro digital con microprocesador" },
      { label: "Formato", value: "48 × 96 mm normalizado" },
      { label: "Programación", value: "Por teclado frontal" },
      { label: "Gabinete", value: 'Rack de aluminio 19"' },
      { label: "Zonas", value: "1, 4, 5 y 6 · otras bajo pedido" },
      { label: "Funciones", value: "Soft-start, modo manual automático, % de potencia" },
      { label: "Medición", value: "Amperímetro integrado" },
    ],
    datasheetUrl:
      "https://www.euroheaters.mx/images/PDFS/catalogo-euroheaters-mexico-septiembre-2018--liv-.pdf",
    configurator: {
      title: "Arme su gabinete",
      question: "¿Cuántas zonas necesita?",
      note: "Fabricamos el rack con la cantidad de zonas que su molde requiera.",
      rackFieldId: "zonas",
      fields: [
        {
          id: "zonas",
          type: "choice",
          label: "Zonas del gabinete",
          options: ["1", "4", "5", "6", "Otra cantidad"],
          defaultValue: "4",
        },
      ],
    },
  },
  {
    slug: "tiempo-de-inyeccion",
    category: "inyeccion",
    shortName: "Tiempo de inyección",
    name: "Controlador de tiempo de inyección",
    tagline: "Secuenciador de válvulas",
    useCase: "Secuencia de compuertas",
    description:
      "Temporizador de secuencia que controla la apertura y el cierre de cada compuerta del canal caliente, para inyectar piezas grandes o multicavidad con mejor acabado.",
    images: [
      {
        src: `${IMG}/tiempo-inyeccion-secuenciador.jpg`,
        width: 750,
        height: 457,
        alt: "Controlador de secuencia de inyección de 6 canales",
      },
    ],
    keyFigures: [
      { value: "24 V / 220 V", label: "Salida DC o AC" },
      { value: "A · B · C", label: "Modos de operación" },
      { value: "Auto", label: "Voltaje en pantalla" },
    ],
    benefits: {
      heading: "Piezas más limpias, desde la primera inyección.",
      highlight: {
        kicker: "Apertura en secuencia",
        tags: ["Modo A", "Modo B", "Modo C"],
        image: {
          src: `${IMG}/tiempo-inyeccion-secuenciador.jpg`,
          width: 750,
          height: 457,
          alt: "Secuenciador de inyección",
        },
      },
      items: [
        {
          title: "Sin líneas de soldadura",
          description:
            "La apertura escalonada de compuertas elimina las líneas donde se encuentran los frentes de flujo.",
        },
        {
          title: "Inyección por compuerta",
          description: "Ajuste la cantidad inyectada en cada compuerta de forma independiente.",
        },
        {
          title: "Menor fuerza de cierre",
          description: "El llenado escalonado reduce la fuerza de cierre necesaria en la máquina.",
        },
        {
          title: "Menos marcas de flujo",
          description: "Mejor acabado superficial en piezas visibles.",
        },
        {
          title: "Voltaje a su medida",
          description: "Salida seleccionable de 24 VDC o 220 VAC según su solenoide.",
        },
      ],
    },
    specs: [
      { label: "Función", value: "Control de apertura y cierre de compuertas" },
      { label: "Voltaje de salida", value: "24 VDC o 220 VAC, según el solenoide" },
      { label: "Indicación", value: "Voltaje de salida visible en operación" },
      { label: "Modos", value: "A, B y C (tiempos de apertura y cierre)" },
    ],
    datasheetUrl:
      "https://www.euroheaters.mx/images/PDFS/catalogo-euroheaters-mexico-septiembre-2018--liv-.pdf",
    configurator: {
      title: "Arme su gabinete",
      question: "¿Cuántas compuertas controla?",
      note: "Indique el voltaje del solenoide de sus válvulas para elegir la salida correcta.",
      rackFieldId: "compuertas",
      fields: [
        {
          id: "compuertas",
          type: "range",
          label: "Compuertas / válvulas",
          min: 1,
          max: 24,
          defaultValue: 6,
          presets: ["1–4", "5–8", "9–16", "17–24"],
        },
        {
          id: "voltaje",
          type: "choice",
          label: "Voltaje del solenoide",
          options: ["24 VDC", "220 VAC"],
          defaultValue: "24 VDC",
        },
      ],
    },
  },
  {
    slug: "presion",
    category: "presion",
    shortName: "Presión",
    name: "Transductores y controladores de presión",
    tagline: "Melt pressure",
    useCase: "Presión de fundido",
    description:
      "Transductores de presión de fundido con diafragma de Inconel y recubrimientos opcionales, más indicadores y controladores para monitorear y controlar la presión del proceso.",
    images: [
      {
        src: `${IMG}/presion-indicadores.jpg`,
        width: 270,
        height: 249,
        alt: "Indicadores y controladores de presión de fundido",
      },
    ],
    keyFigures: [
      { value: "0–20,000", label: "Rango hasta psi" },
      { value: "400 °C", label: "Temperatura máx." },
      { value: "3 años", label: "Garantía de fabricación" },
    ],
    benefits: {
      heading: "Presión de proceso bajo control.",
      highlight: {
        kicker: "Reemplazo directo",
        tags: ["Inconel", "PID", "4–20 mA"],
        image: {
          src: `${IMG}/presion-indicadores.jpg`,
          width: 270,
          height: 249,
          alt: "Indicadores de presión",
        },
      },
      items: [
        {
          title: "Intercambiable",
          description:
            "Compatible con modelos de otras marcas, de llenado de fluido o de varilla: cambie sin rediseñar su instalación.",
        },
        {
          title: "Garantía de 3 años",
          description: "Transductores con garantía contra defectos de fabricación.",
        },
        {
          title: "Alarmas configurables",
          description:
            "Dos alarmas Alta / Baja / Apagado; tres en la versión presión + temperatura.",
        },
        {
          title: "Respuesta de 100 ms",
          description: "Muestreo y control rápidos con sintonía PID.",
        },
        {
          title: "Retransmisión 4–20 mA",
          description: "Envíe el valor de proceso a su PLC o sistema de registro.",
        },
        {
          title: "Presión + temperatura",
          description: "Medidor dual con entrada de termopar tipo J.",
        },
      ],
    },
    specs: [
      { label: "Diafragma", value: "Inconel estándar, recubrimientos opcionales" },
      { label: "Rango", value: "De 0–500 psi a 0–20,000 psi" },
      { label: "Temperatura máx.", value: "400 °C (750 °F)" },
      { label: "Error combinado", value: "0.5 %" },
      { label: "Conector", value: "Bayoneta de 6 pines" },
      { label: "Entrada (controlador)", value: "Galga extensiométrica 350 Ω" },
      { label: "Retransmisión", value: "4–20 mA" },
      { label: "Muestreo", value: "100 ms" },
    ],
    datasheetUrl:
      "https://www.euroheaters.mx/images/PDFS/ficha-tecnica-de-transductores-de-precin.pdf",
    configurator: {
      title: "Configure su equipo",
      question: "¿Qué necesita medir o controlar?",
      note: "Si reemplaza un transductor de otra marca, indíquenos el modelo actual.",
      fields: [
        {
          id: "equipo",
          type: "choice",
          label: "Equipo",
          options: ["Transductor", "Indicador", "Controlador", "Presión + temperatura"],
          defaultValue: "Transductor",
        },
        {
          id: "rango",
          type: "choice",
          label: "Rango requerido",
          options: ["Hasta 500 psi", "Hasta 5,000 psi", "Hasta 10,000 psi", "Hasta 20,000 psi"],
          defaultValue: "Hasta 10,000 psi",
        },
        {
          id: "conexion",
          type: "choice",
          label: "Conexión",
          options: ["Rígida", 'Manguera flexible 18"'],
          defaultValue: "Rígida",
        },
      ],
    },
  },
];
