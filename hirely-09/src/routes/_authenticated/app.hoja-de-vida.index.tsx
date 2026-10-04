/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { CrudSection, formatDate, type Field } from "@/components/crud-section";
import { SkillsSection } from "@/components/skills-section";
import type { Row } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/app/hoja-de-vida/")({
  head: () => ({
    meta: [
      { title: "Mi hoja de vida — Hirely" },
      {
        name: "description",
        content: "Educación, experiencia, habilidades, idiomas y logros de tu hoja de vida en Hirely.",
      },
      { property: "og:title", content: "Mi hoja de vida — Hirely" },
      { property: "og:description", content: "Educación, experiencia, habilidades y logros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HojaDeVida,
});

const rango = (row: Row, start = "start_date", end = "end_date", actual?: string) => {
  const desde = formatDate(row[start] as string | null);
  const hasta = actual && row[actual] ? "Actualidad" : formatDate(row[end] as string | null);
  if (!desde && !hasta) return null;
  return [desde ?? "—", hasta ?? "—"].join(" – ");
};

const juntar = (...parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).join(" · ") || null;

export const educacionFields: Field[] = [
  { name: "institution", label: "Institución", required: true, half: true },
  {
    name: "level",
    label: "Nivel",
    type: "select",
    half: true,
    options: ["Bachillerato", "Técnico", "Tecnólogo", "Pregrado", "Especialización", "Maestría", "Doctorado"],
  },
  { name: "program", label: "Programa", half: true, placeholder: "Ingeniería de Sistemas" },
  { name: "degree", label: "Título obtenido", half: true },
  {
    name: "status",
    label: "Estado",
    type: "select",
    required: true,
    half: true,
    options: ["En curso", "Terminado", "Aplazado", "Abandonado"],
  },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  { name: "end_date", label: "Fecha de fin", type: "date", half: true },
  { name: "description", label: "Descripción", type: "textarea" },
  { name: "achievements", label: "Logros", type: "textarea" },
];

export const experienciaFields: Field[] = [
  { name: "company", label: "Empresa", required: true, half: true },
  { name: "position", label: "Cargo", required: true, half: true },
  { name: "area", label: "Área", half: true },
  {
    name: "contract_type",
    label: "Tipo de contrato",
    type: "select",
    half: true,
    options: ["Indefinido", "Término fijo", "Prestación de servicios", "Prácticas", "Freelance"],
  },
  { name: "city", label: "Ciudad", half: true },
  { name: "country", label: "País", half: true },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  {
    name: "end_date",
    label: "Fecha de fin",
    type: "date",
    half: true,
    hideIf: (v) => !!v["currently_working"],
  },
  { name: "currently_working", label: "Actualmente trabajo aquí", type: "checkbox" },
  { name: "description", label: "Descripción", type: "textarea" },
  { name: "responsibilities", label: "Responsabilidades", type: "textarea" },
  { name: "achievements", label: "Logros", type: "textarea" },
];

export const idiomasFields: Field[] = [
  { name: "language", label: "Idioma", required: true, half: true },
  {
    name: "overall_level",
    label: "Nivel general",
    type: "select",
    half: true,
    options: ["A1", "A2", "B1", "B2", "C1", "C2", "Nativo"],
  },
  { name: "reading_level", label: "Lectura", half: true },
  { name: "writing_level", label: "Escritura", half: true },
  { name: "speaking_level", label: "Conversación", half: true },
  { name: "certification", label: "Certificación", half: true },
  { name: "certification_date", label: "Fecha de certificación", type: "date", half: true },
];

export const cursosFields: Field[] = [
  { name: "name", label: "Nombre del curso", required: true, half: true },
  { name: "institution", label: "Institución", half: true },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  { name: "end_date", label: "Fecha de fin", type: "date", half: true },
  { name: "duration", label: "Duración", half: true, placeholder: "40 horas" },
  { name: "description", label: "Descripción", type: "textarea" },
];

export const certificacionesFields: Field[] = [
  { name: "name", label: "Nombre", required: true, half: true },
  { name: "issuing_organization", label: "Organización emisora", half: true },
  { name: "issue_date", label: "Fecha de emisión", type: "date", half: true },
  { name: "expiration_date", label: "Fecha de vencimiento", type: "date", half: true },
  { name: "credential_id", label: "ID de la credencial", half: true },
  { name: "credential_url", label: "URL de la credencial", type: "url", half: true },
];

export const proyectosFields: Field[] = [
  { name: "name", label: "Nombre del proyecto", required: true, half: true },
  { name: "role", label: "Tu rol", half: true },
  { name: "organization", label: "Organización", half: true },
  { name: "url", label: "Enlace", type: "url", half: true },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  { name: "end_date", label: "Fecha de fin", type: "date", half: true },
  { name: "technologies", label: "Tecnologías", half: true, placeholder: "React, Node.js" },
  { name: "description", label: "Descripción", type: "textarea" },
  { name: "achievements", label: "Logros", type: "textarea" },
];

export const voluntariadoFields: Field[] = [
  { name: "organization", label: "Organización", required: true, half: true },
  { name: "role", label: "Rol", half: true },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  { name: "end_date", label: "Fecha de fin", type: "date", half: true },
  { name: "description", label: "Descripción", type: "textarea" },
  { name: "achievements", label: "Logros", type: "textarea" },
];

export const actividadesFields: Field[] = [
  { name: "title", label: "Título", required: true, half: true },
  { name: "organization", label: "Organización", half: true },
  { name: "start_date", label: "Fecha de inicio", type: "date", half: true },
  { name: "end_date", label: "Fecha de fin", type: "date", half: true },
  { name: "description", label: "Descripción", type: "textarea" },
];

export const premiosFields: Field[] = [
  { name: "name", label: "Nombre del premio", required: true, half: true },
  { name: "organization", label: "Organización", half: true },
  { name: "award_date", label: "Fecha", type: "date", half: true },
  { name: "description", label: "Descripción", type: "textarea" },
];

export const publicacionesFields: Field[] = [
  { name: "title", label: "Título", required: true, half: true },
  { name: "publisher", label: "Editorial o medio", half: true },
  { name: "publication_date", label: "Fecha de publicación", type: "date", half: true },
  { name: "url", label: "Enlace", type: "url", half: true },
  { name: "description", label: "Descripción", type: "textarea" },
];

const referenciasFields: Field[] = [
  { name: "name", label: "Nombre", required: true, half: true },
  { name: "position", label: "Cargo", half: true },
  { name: "organization", label: "Organización", half: true },
  { name: "relationship", label: "Relación", half: true, placeholder: "Jefe directo" },
  { name: "email", label: "Correo", type: "email", half: true },
  { name: "phone", label: "Teléfono", type: "tel", half: true },
  { name: "notes", label: "Notas", type: "textarea" },
];

function HojaDeVida() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Mi hoja de vida"
        description="Tu información profesional, guardada en tu cuenta y lista para generar CVs."
        actions={
          <>
            <Button asChild size="sm">
              <Link to="/app/hoja-de-vida/generar">
                <Sparkles className="size-4" /> Generar CV
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/perfil/importar-cv">
                <Upload className="size-4" /> Importar CV
              </Link>
            </Button>
          </>
        }
      />

      <div className="mt-9 space-y-5">
        <CrudSection
          table="education"
          title="Educación"
          description="Tu formación académica, de la más reciente a la más antigua."
          singular="Estudio"
          fields={educacionFields}
          renderTitle={(r) => String(r["institution"] ?? "")}
          renderMeta={(r) =>
            juntar(
              (r["program"] as string) ?? (r["degree"] as string),
              rango(r),
              r["status"] as string,
            )
          }
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="work_experience"
          title="Experiencia laboral"
          description="Empleos, prácticas y trabajos independientes."
          singular="Experiencia"
          fields={experienciaFields}
          renderTitle={(r) => `${r["position"] ?? ""} — ${r["company"] ?? ""}`}
          renderMeta={(r) =>
            juntar(
              rango(r, "start_date", "end_date", "currently_working"),
              juntar(r["city"] as string, r["country"] as string),
              r["contract_type"] as string,
            )
          }
          renderBody={(r) => (r["description"] as string) ?? (r["responsibilities"] as string) ?? null}
        />

        <SkillsSection />

        <CrudSection
          table="languages"
          title="Idiomas"
          description="Idiomas que manejas y tu nivel."
          singular="Idioma"
          fields={idiomasFields}
          renderTitle={(r) => String(r["language"] ?? "")}
          renderMeta={(r) => juntar(r["overall_level"] as string, r["certification"] as string)}
        />

        <CrudSection
          table="courses"
          title="Cursos"
          description="Formación complementaria y capacitaciones."
          singular="Curso"
          fields={cursosFields}
          renderTitle={(r) => String(r["name"] ?? "")}
          renderMeta={(r) => juntar(r["institution"] as string, rango(r), r["duration"] as string)}
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="certifications"
          title="Certificaciones"
          description="Credenciales oficiales vigentes o vencidas."
          singular="Certificación"
          fields={certificacionesFields}
          renderTitle={(r) => String(r["name"] ?? "")}
          renderMeta={(r) =>
            juntar(
              r["issuing_organization"] as string,
              formatDate(r["issue_date"] as string | null),
              r["credential_id"] as string,
            )
          }
        />

        <CrudSection
          table="projects"
          title="Proyectos"
          description="Proyectos personales, académicos o profesionales."
          singular="Proyecto"
          fields={proyectosFields}
          renderTitle={(r) => String(r["name"] ?? "")}
          renderMeta={(r) =>
            juntar(r["role"] as string, r["organization"] as string, rango(r), r["technologies"] as string)
          }
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="volunteering"
          title="Voluntariado"
          description="Trabajo social y participación comunitaria."
          singular="Voluntariado"
          fields={voluntariadoFields}
          renderTitle={(r) => String(r["organization"] ?? "")}
          renderMeta={(r) => juntar(r["role"] as string, rango(r))}
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="activities"
          title="Actividades"
          description="Actividades extracurriculares, ponencias y grupos."
          singular="Actividad"
          fields={actividadesFields}
          renderTitle={(r) => String(r["title"] ?? "")}
          renderMeta={(r) => juntar(r["organization"] as string, rango(r))}
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="awards"
          title="Premios y reconocimientos"
          singular="Premio"
          fields={premiosFields}
          renderTitle={(r) => String(r["name"] ?? "")}
          renderMeta={(r) =>
            juntar(r["organization"] as string, formatDate(r["award_date"] as string | null))
          }
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="publications"
          title="Publicaciones"
          singular="Publicación"
          fields={publicacionesFields}
          renderTitle={(r) => String(r["title"] ?? "")}
          renderMeta={(r) =>
            juntar(r["publisher"] as string, formatDate(r["publication_date"] as string | null))
          }
          renderBody={(r) => (r["description"] as string) ?? null}
        />

        <CrudSection
          table="references"
          title="Referencias"
          description="Personas que pueden dar referencia de tu trabajo."
          singular="Referencia"
          fields={referenciasFields}
          renderTitle={(r) => String(r["name"] ?? "")}
          renderMeta={(r) =>
            juntar(r["position"] as string, r["organization"] as string, r["relationship"] as string)
          }
          renderBody={(r) => juntar(r["email"] as string, r["phone"] as string)}
        />
      </div>
    </div>
  );
}
