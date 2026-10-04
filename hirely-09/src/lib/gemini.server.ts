// Ayudante para llamar a la API de Gemini (Google AI Studio) y extraer
// datos estructurados de un CV en PDF.
//
// IMPORTANTE: este archivo solo debe importarse desde código de servidor
// (funciones .server.ts o server functions), nunca desde un componente
// de cliente: usa GEMINI_API_KEY, que vive únicamente en el entorno del
// servidor y jamás debe llegar al navegador.

import { cvExtractionSchema, type CvExtraction } from "./cv-import.schema";

// IMPORTANTE (15/09/2026), historial de este ajuste:
// 1) "gemini-flash-latest" apuntaba a Gemini 3.8 Flash: cuota gratuita de solo 20
//    solicitudes/día (confirmado en Google AI Studio), se agotó enseguida.
// 2) "gemini-2.5-flash" aparece en scripts/listar-modelos-gemini.mjs (existe), pero al
//    llamarlo Gemini respondió 404 con este mensaje exacto: "This model
//    models/gemini-2.5-flash is no longer available to new users. Please update your
//    code to use models/gemini-3.6-flash for the latest features and improvements."
//    Lección: que un modelo aparezca en ListModels no garantiza que generateContent lo
//    acepte para esta clave — hay que probarlo de verdad (ver scripts/probar-gemini.mjs).
// 3) Se sigue la recomendación literal de Google: gemini-3.6-flash.
//
// De momento NO hay un modelo de respaldo alterno: agregar uno sin probarlo primero con
// scripts/probar-gemini.mjs desperdiciaría más cuota diaria en otro posible 404.
const PRIMARY_MODEL = "gemini-3.6-flash";

function urlDelModelo(modelo: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
}

const stringProp = () => ({ type: "STRING", nullable: true }) as const;
const boolProp = () => ({ type: "BOOLEAN" }) as const;

// Debe reflejar exactamente los campos de cv-import.schema.ts. Si agregas
// o quitas un campo allá, actualiza también aquí.
const PROFILE_SCHEMA = {
  type: "OBJECT",
  properties: {
    first_name: stringProp(),
    last_name: stringProp(),
    headline: stringProp(),
    professional_summary: stringProp(),
    career_objective: stringProp(),
    phone: stringProp(),
    phone_secondary: stringProp(),
    current_city: stringProp(),
    current_country: stringProp(),
    linkedin_url: stringProp(),
    website_url: stringProp(),
    portfolio_url: stringProp(),
  },
} as const;

const EDUCATION_SCHEMA = {
  type: "OBJECT",
  properties: {
    institution: stringProp(),
    level: stringProp(),
    program: stringProp(),
    degree: stringProp(),
    status: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    description: stringProp(),
    achievements: stringProp(),
  },
} as const;

const WORK_EXPERIENCE_SCHEMA = {
  type: "OBJECT",
  properties: {
    company: stringProp(),
    position: stringProp(),
    area: stringProp(),
    contract_type: stringProp(),
    city: stringProp(),
    country: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    currently_working: boolProp(),
    description: stringProp(),
    responsibilities: stringProp(),
    achievements: stringProp(),
  },
} as const;

const LANGUAGE_SCHEMA = {
  type: "OBJECT",
  properties: {
    language: stringProp(),
    overall_level: stringProp(),
    reading_level: stringProp(),
    writing_level: stringProp(),
    speaking_level: stringProp(),
    certification: stringProp(),
    certification_date: stringProp(),
  },
} as const;

const SKILL_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: stringProp(),
    category: stringProp(),
  },
} as const;

const CERTIFICATION_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: stringProp(),
    issuing_organization: stringProp(),
    issue_date: stringProp(),
    expiration_date: stringProp(),
    credential_id: stringProp(),
    credential_url: stringProp(),
  },
} as const;

const COURSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: stringProp(),
    institution: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    duration: stringProp(),
    description: stringProp(),
  },
} as const;

const PROJECT_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: stringProp(),
    role: stringProp(),
    organization: stringProp(),
    url: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    technologies: stringProp(),
    description: stringProp(),
    achievements: stringProp(),
  },
} as const;

const VOLUNTEERING_SCHEMA = {
  type: "OBJECT",
  properties: {
    organization: stringProp(),
    role: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    description: stringProp(),
    achievements: stringProp(),
  },
} as const;

const ACTIVITY_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: stringProp(),
    organization: stringProp(),
    start_date: stringProp(),
    end_date: stringProp(),
    description: stringProp(),
  },
} as const;

const AWARD_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: stringProp(),
    organization: stringProp(),
    award_date: stringProp(),
    description: stringProp(),
  },
} as const;

const PUBLICATION_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: stringProp(),
    publisher: stringProp(),
    publication_date: stringProp(),
    url: stringProp(),
    description: stringProp(),
  },
} as const;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    profile: PROFILE_SCHEMA,
    education: { type: "ARRAY", items: EDUCATION_SCHEMA },
    work_experience: { type: "ARRAY", items: WORK_EXPERIENCE_SCHEMA },
    languages: { type: "ARRAY", items: LANGUAGE_SCHEMA },
    skills: { type: "ARRAY", items: SKILL_SCHEMA },
    certifications: { type: "ARRAY", items: CERTIFICATION_SCHEMA },
    courses: { type: "ARRAY", items: COURSE_SCHEMA },
    projects: { type: "ARRAY", items: PROJECT_SCHEMA },
    volunteering: { type: "ARRAY", items: VOLUNTEERING_SCHEMA },
    activities: { type: "ARRAY", items: ACTIVITY_SCHEMA },
    awards: { type: "ARRAY", items: AWARD_SCHEMA },
    publications: { type: "ARRAY", items: PUBLICATION_SCHEMA },
  },
  required: ["profile"],
} as const;

// IMPORTANTE (16/09/2026, ajuste del prompt tras la primera prueba real con el CV de Isa):
// se detectaron 3 problemas reales de calidad de extracción (no de conexión/modelo):
// 1) Gemini juntaba varias habilidades en un solo texto ("Excel, Word, Photoshop" como un
//    único elemento de "skills") en vez de un elemento por habilidad. Se agregó la regla 3.
// 2) En "languages", copiaba el mismo nivel en reading/writing/speaking/overall aunque el CV
//    solo mencionara un nivel general. Se agregó la regla 4, explícita sobre no copiar entre
//    campos hermanos.
// 3) Casi ninguna fecha se detectaba: la regla anterior ("si no hay día o mes exactos, deja
//    null") hacía que Gemini anulara fechas con precisión de solo mes/año o solo año, que es
//    lo normal en un CV. Se reemplazó por la regla 2: se reporta la fecha con la precisión
//    disponible, usando "01" como relleno del día/mes que falte (nunca inventando el año).
const PROMPT = `Eres un asistente que extrae información de hojas de vida (CV) en PDF para la aplicación Hirely.

Reglas estrictas:
1. Reporta ÚNICAMENTE datos que estén escritos de forma explícita en el PDF. Nunca inventes, completes ni deduzcas información que no esté presente.
2. Fechas: usa siempre el formato "YYYY-MM-DD".
   - Si el PDF indica día, mes y año exactos, repórtalos tal cual.
   - Si el PDF solo indica mes y año (sin día exacto), usa "01" como día (ejemplo: "Marzo 2022" → "2022-03-01").
   - Si el PDF solo indica el año (sin mes ni día), usa "01" como mes y como día (ejemplo: "2022" → "2022-01-01").
   - Deja el campo en null ÚNICAMENTE si el PDF no menciona ninguna fecha para ese elemento. Nunca dejes una fecha en null solo porque le falta precisión de día o mes: reportar el año o el mes que sí aparece (rellenando el resto con "01") es mejor que perder el dato. El "01" de relleno nunca debe inventar el año.
3. Habilidades ("skills"): cada habilidad individual debe ser su propio elemento del arreglo "skills", con su propio "name". Nunca combines varias habilidades en un solo texto separado por comas ni las agrupes en un solo elemento (ejemplo: si el CV dice "Excel, Word, Photoshop", son 3 elementos separados, no 1).
4. Idiomas ("languages"): "overall_level", "reading_level", "writing_level" y "speaking_level" son campos independientes entre sí. Llena cada uno ÚNICAMENTE si el PDF indica explícitamente un nivel para esa destreza en particular. Nunca copies el valor de un campo a otro asumiendo que aplica igual a todos. Si el CV solo menciona un nivel general del idioma (por ejemplo "Inglés: B2") sin desglosar por destreza, reporta ese valor solo en "overall_level" y deja "reading_level", "writing_level" y "speaking_level" en null.
5. Si una sección completa no aparece en el CV (por ejemplo, no hay certificaciones), devuelve un arreglo vacío para esa sección; no la inventes.
6. No extraigas ni reportes número de documento de identidad, fecha o lugar de nacimiento, ni nacionalidad, aunque aparezcan en el PDF.
7. Responde solo con el JSON solicitado, sin texto adicional.`;

export type GeminiExtractionResult =
  | { ok: true; data: CvExtraction }
  | { ok: false; error: string };

/**
 * Envía el PDF (como base64) a Gemini y devuelve los datos ya validados
 * contra cvExtractionSchema. No lanza excepciones de red/formato: las
 * atrapa y las devuelve como { ok: false, error }.
 */
function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// gemini-3.6-flash ya está confirmado como un modelo válido (prueba real con
// scripts/probar-gemini.mjs devolvió 200), así que un 503 aquí es saturación transitoria de
// verdad, no un modelo mal escrito o retirado — vale la pena reintentar un poco más que antes.
// Sigue sin haber modelo de respaldo (se agregará solo tras verificarlo con probar-gemini.mjs).
const PLAN_DE_INTENTOS: { modelo: string; esperaPreviaMs: number }[] = [
  { modelo: PRIMARY_MODEL, esperaPreviaMs: 0 },
  { modelo: PRIMARY_MODEL, esperaPreviaMs: 2000 },
  { modelo: PRIMARY_MODEL, esperaPreviaMs: 4000 },
];

/**
 * Envía el PDF (como base64) a Gemini y devuelve los datos ya validados
 * contra cvExtractionSchema. No lanza excepciones de red/formato: las
 * atrapa y las devuelve como { ok: false, error }.
 */
export async function extractCvWithGemini(pdfBase64: string): Promise<GeminiExtractionResult> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    return { ok: false, error: "Falta configurar GEMINI_API_KEY en el servidor." };
  }

  const body = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: "application/pdf", data: pdfBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  let response: Response | null = null;

  for (let i = 0; i < PLAN_DE_INTENTOS.length; i++) {
    const paso = PLAN_DE_INTENTOS[i]!;
    const esUltimoIntento = i === PLAN_DE_INTENTOS.length - 1;

    if (paso.esperaPreviaMs > 0) {
      await esperar(paso.esperaPreviaMs + Math.random() * 400);
    }

    let intento: Response;
    try {
      intento = await fetch(urlDelModelo(paso.modelo), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body,
      });
    } catch {
      if (esUltimoIntento) {
        return {
          ok: false,
          error: "No pudimos conectarnos con el servicio de IA. Revisa tu conexión e inténtalo de nuevo.",
        };
      }
      continue;
    }

    if (intento.status === 503) {
      console.error(`Gemini (${paso.modelo}) respondió 503 (intento ${i + 1} de ${PLAN_DE_INTENTOS.length}).`);
      if (!esUltimoIntento) continue;
      return {
        ok: false,
        error:
          "El servicio de IA está saturado en este momento (es normal en su capa gratuita). Espera uno o dos minutos y vuelve a intentarlo.",
      };
    }

    response = intento;
    break;
  }

  if (!response) {
    return {
      ok: false,
      error: "No pudimos conectarnos con el servicio de IA. Revisa tu conexión e inténtalo de nuevo.",
    };
  }

  if (!response.ok) {
    if (response.status === 429) {
      return {
        ok: false,
        error: "Se alcanzó el límite de uso gratuito de la IA por ahora. Inténtalo de nuevo en unos minutos.",
      };
    }
    const detalle = await response.text().catch(() => "");
    console.error(`Gemini respondió ${response.status}:`, detalle);
    return { ok: false, error: `El servicio de IA respondió con un error (${response.status}).` };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, error: "La respuesta de la IA no se pudo leer." };
  }

  const text = (
    payload as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  )?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return { ok: false, error: "La IA no devolvió información. Intenta con otro archivo." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "La IA devolvió un formato inesperado. Inténtalo de nuevo." };
  }

  const result = cvExtractionSchema.safeParse(parsed);
  if (!result.success) {
    return { ok: false, error: "No pudimos interpretar la información extraída del PDF." };
  }

  return { ok: true, data: result.data };
}
