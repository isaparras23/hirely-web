import { z } from "zod";

/**
 * Esquema de los datos que la IA (Gemini) debe extraer de un CV en PDF.
 *
 * Los nombres de cada campo son EXACTAMENTE los mismos que las columnas
 * reales de Supabase (ver src/integrations/supabase/types.ts), para que
 * el mapeo al guardar sea directo y no haga falta "traducir" nada.
 *
 * Reglas de extracción (reforzadas también en el prompt de gemini.server.ts):
 * - Solo se reporta lo que el PDF dice de forma explícita. Nunca se
 *   inventa ni se completa un dato que no esté escrito.
 * - Si una fecha no trae día o mes exacto, se deja en null en vez de
 *   adivinar.
 * - No se piden datos sensibles (documento, fecha/lugar de nacimiento,
 *   nacionalidad) ni preferencias internas de Hirely (salario esperado,
 *   modalidad, disponibilidad para viajar, etc.): esos se llenan
 *   manualmente en Mi Perfil.
 * - No se extraen "references": son datos de contacto de otra persona,
 *   no del usuario, así que se agregan siempre a mano.
 */

const optionalText = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : null));

const optionalDate = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : null));

const optionalBoolean = z
  .boolean()
  .nullable()
  .optional()
  .transform((v) => !!v);

export const extractedProfileSchema = z.object({
  first_name: optionalText,
  last_name: optionalText,
  headline: optionalText,
  professional_summary: optionalText,
  career_objective: optionalText,
  phone: optionalText,
  phone_secondary: optionalText,
  current_city: optionalText,
  current_country: optionalText,
  linkedin_url: optionalText,
  website_url: optionalText,
  portfolio_url: optionalText,
});

export const extractedEducationSchema = z.object({
  institution: optionalText,
  level: optionalText,
  program: optionalText,
  degree: optionalText,
  status: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  description: optionalText,
  achievements: optionalText,
});

export const extractedWorkExperienceSchema = z.object({
  company: optionalText,
  position: optionalText,
  area: optionalText,
  contract_type: optionalText,
  city: optionalText,
  country: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  currently_working: optionalBoolean,
  description: optionalText,
  responsibilities: optionalText,
  achievements: optionalText,
});

export const extractedLanguageSchema = z.object({
  language: optionalText,
  overall_level: optionalText,
  reading_level: optionalText,
  writing_level: optionalText,
  speaking_level: optionalText,
  certification: optionalText,
  certification_date: optionalDate,
});

export const extractedSkillSchema = z.object({
  name: optionalText,
  category: optionalText,
});

export const extractedCertificationSchema = z.object({
  name: optionalText,
  issuing_organization: optionalText,
  issue_date: optionalDate,
  expiration_date: optionalDate,
  credential_id: optionalText,
  credential_url: optionalText,
});

export const extractedCourseSchema = z.object({
  name: optionalText,
  institution: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  duration: optionalText,
  description: optionalText,
});

export const extractedProjectSchema = z.object({
  name: optionalText,
  role: optionalText,
  organization: optionalText,
  url: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  technologies: optionalText,
  description: optionalText,
  achievements: optionalText,
});

export const extractedVolunteeringSchema = z.object({
  organization: optionalText,
  role: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  description: optionalText,
  achievements: optionalText,
});

export const extractedActivitySchema = z.object({
  title: optionalText,
  organization: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  description: optionalText,
});

export const extractedAwardSchema = z.object({
  name: optionalText,
  organization: optionalText,
  award_date: optionalDate,
  description: optionalText,
});

export const extractedPublicationSchema = z.object({
  title: optionalText,
  publisher: optionalText,
  publication_date: optionalDate,
  url: optionalText,
  description: optionalText,
});

/**
 * Forma completa que debe devolver Gemini. Cada arreglo puede venir
 * vacío (no todos los CV tienen todas las secciones), pero la llave
 * nunca debe faltar.
 */
export const cvExtractionSchema = z.object({
  profile: extractedProfileSchema,
  education: z.array(extractedEducationSchema).optional().default([]),
  work_experience: z.array(extractedWorkExperienceSchema).optional().default([]),
  languages: z.array(extractedLanguageSchema).optional().default([]),
  skills: z.array(extractedSkillSchema).optional().default([]),
  certifications: z.array(extractedCertificationSchema).optional().default([]),
  courses: z.array(extractedCourseSchema).optional().default([]),
  projects: z.array(extractedProjectSchema).optional().default([]),
  volunteering: z.array(extractedVolunteeringSchema).optional().default([]),
  activities: z.array(extractedActivitySchema).optional().default([]),
  awards: z.array(extractedAwardSchema).optional().default([]),
  publications: z.array(extractedPublicationSchema).optional().default([]),
});

export type CvExtraction = z.infer<typeof cvExtractionSchema>;
