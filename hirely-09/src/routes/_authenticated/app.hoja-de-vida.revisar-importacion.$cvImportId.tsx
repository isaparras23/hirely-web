/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Section } from "@/components/layout";
import { type Field } from "@/components/crud-section";
import { CvReviewList, draftsFromExtracted, type DraftItem } from "@/components/cv-review-list";
import { NIVELES, CATEGORIAS } from "@/components/skills-section";
import {
  educacionFields,
  experienciaFields,
  idiomasFields,
  cursosFields,
  certificacionesFields,
  proyectosFields,
  voluntariadoFields,
  actividadesFields,
  premiosFields,
  publicacionesFields,
} from "@/routes/_authenticated/app.hoja-de-vida.index";
import { useCvImport, useSaveRow, useSaveSkill, type Row } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/app/hoja-de-vida/revisar-importacion/$cvImportId")({
  head: () => ({
    meta: [
      { title: "Revisar hoja de vida importada — Hirely" },
      {
        name: "description",
        content: "Revisa y guarda la educación, experiencia y demás datos detectados desde tu CV.",
      },
      { property: "og:title", content: "Revisar hoja de vida importada — Hirely" },
      { property: "og:description", content: "Confirma los datos de tu hoja de vida antes de guardarlos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RevisarHojaDeVidaImportada,
});

const skillsFields: Field[] = [
  { name: "name", label: "Habilidad", required: true, half: true, placeholder: "React, Comunicación…" },
  { name: "category", label: "Categoría", type: "select", half: true, options: CATEGORIAS },
  { name: "proficiency_level", label: "Nivel", type: "select", half: true, options: NIVELES },
  { name: "description", label: "Descripción", type: "textarea" },
];

type Seccion = {
  key: string;
  table: string;
  titulo: string;
  singular: string;
  fields: Field[];
  renderTitle: (v: Row) => string;
  esHabilidad?: boolean;
};

const SECCIONES: Seccion[] = [
  {
    key: "education",
    table: "education",
    titulo: "Educación",
    singular: "Estudio",
    fields: educacionFields,
    renderTitle: (v) => String(v["institution"] ?? ""),
  },
  {
    key: "work_experience",
    table: "work_experience",
    titulo: "Experiencia laboral",
    singular: "Experiencia",
    fields: experienciaFields,
    renderTitle: (v) => `${v["position"] ?? ""} — ${v["company"] ?? ""}`,
  },
  {
    key: "skills",
    table: "profile_skills",
    titulo: "Habilidades",
    singular: "Habilidad",
    fields: skillsFields,
    renderTitle: (v) => String(v["name"] ?? ""),
    esHabilidad: true,
  },
  {
    key: "languages",
    table: "languages",
    titulo: "Idiomas",
    singular: "Idioma",
    fields: idiomasFields,
    renderTitle: (v) => String(v["language"] ?? ""),
  },
  {
    key: "courses",
    table: "courses",
    titulo: "Cursos",
    singular: "Curso",
    fields: cursosFields,
    renderTitle: (v) => String(v["name"] ?? ""),
  },
  {
    key: "certifications",
    table: "certifications",
    titulo: "Certificaciones",
    singular: "Certificación",
    fields: certificacionesFields,
    renderTitle: (v) => String(v["name"] ?? ""),
  },
  {
    key: "projects",
    table: "projects",
    titulo: "Proyectos",
    singular: "Proyecto",
    fields: proyectosFields,
    renderTitle: (v) => String(v["name"] ?? ""),
  },
  {
    key: "volunteering",
    table: "volunteering",
    titulo: "Voluntariado",
    singular: "Voluntariado",
    fields: voluntariadoFields,
    renderTitle: (v) => String(v["organization"] ?? ""),
  },
  {
    key: "activities",
    table: "activities",
    titulo: "Actividades",
    singular: "Actividad",
    fields: actividadesFields,
    renderTitle: (v) => String(v["title"] ?? ""),
  },
  {
    key: "awards",
    table: "awards",
    titulo: "Premios y reconocimientos",
    singular: "Premio",
    fields: premiosFields,
    renderTitle: (v) => String(v["name"] ?? ""),
  },
  {
    key: "publications",
    table: "publications",
    titulo: "Publicaciones",
    singular: "Publicación",
    fields: publicacionesFields,
    renderTitle: (v) => String(v["title"] ?? ""),
  },
];

function isReady(values: Row, fields: Field[]): boolean {
  for (const f of fields) {
    if (f.required && !String(values[f.name] ?? "").trim()) return false;
  }
  return true;
}

function normalize(values: Row, fields: Field[]): Row {
  const payload: Row = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "checkbox") payload[f.name] = !!raw;
    else if (f.type === "number") payload[f.name] = raw === "" || raw == null ? null : Number(raw);
    else payload[f.name] = raw === "" || raw == null ? null : String(raw).trim();
  }
  return payload;
}

function RevisarHojaDeVidaImportada() {
  const { cvImportId } = Route.useParams();
  const navigate = useNavigate();
  const { data: cvImport, isLoading } = useCvImport(cvImportId);
  const [drafts, setDrafts] = useState<Record<string, DraftItem[]>>({});
  const [listo, setListo] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cvImport && !listo) {
      const extraido = (cvImport["extracted_data"] as Row | null) ?? {};
      const iniciales: Record<string, DraftItem[]> = {};
      for (const s of SECCIONES) {
        const base = draftsFromExtracted(extraido[s.key] as Row[] | undefined);
        iniciales[s.key] = s.esHabilidad
          ? base.map((d) => ({
              ...d,
              values: {
                ...d.values,
                category: d.values["category"] || CATEGORIAS[0],
                proficiency_level: d.values["proficiency_level"] || NIVELES[1],
              },
            }))
          : base;
      }
      setDrafts(iniciales);
      setListo(true);
    }
  }, [cvImport, listo]);

  // Un hook de guardado por cada tabla real: no se pueden llamar hooks dentro de un bucle o condicional.
  const saveEducation = useSaveRow("education");
  const saveWorkExperience = useSaveRow("work_experience");
  const saveLanguages = useSaveRow("languages");
  const saveCourses = useSaveRow("courses");
  const saveCertifications = useSaveRow("certifications");
  const saveProjects = useSaveRow("projects");
  const saveVolunteering = useSaveRow("volunteering");
  const saveActivities = useSaveRow("activities");
  const saveAwards = useSaveRow("awards");
  const savePublications = useSaveRow("publications");
  const saveSkill = useSaveSkill();

  const saversPorTabla: Record<string, ReturnType<typeof useSaveRow>> = {
    education: saveEducation,
    work_experience: saveWorkExperience,
    languages: saveLanguages,
    courses: saveCourses,
    certifications: saveCertifications,
    projects: saveProjects,
    volunteering: saveVolunteering,
    activities: saveActivities,
    awards: saveAwards,
    publications: savePublications,
  };

  // IMPORTANTE (16/09/2026, corrección de un bug real): antes, si UN elemento fallaba al
  // guardar (por ejemplo, un error de la base de datos en "experiencia laboral"), toda la
  // función se detenía ahí — las secciones que venían después nunca se intentaban, y los
  // elementos que sí se habían guardado ANTES del fallo seguían marcados como "incluidos".
  // Si el usuario reintentaba con "Guardar" (algo razonable cuando ve un error), esos
  // elementos ya guardados se volvían a guardar, duplicándolos (así se duplicó la
  // información de Isa varias veces). Ahora cada elemento se intenta de forma independiente:
  // un fallo puntual no bloquea el resto, y todo lo que se guarda con éxito se quita de la
  // lista de inmediato, así un reintento solo vuelve a intentar lo que de verdad falta.
  const guardarTodo = async () => {
    setGuardando(true);
    let guardados = 0;
    let omitidos = 0;
    let fallidos = 0;
    let primerError: string | null = null;
    const restantes: Record<string, DraftItem[]> = {};

    for (const s of SECCIONES) {
      const items = drafts[s.key] ?? [];
      const noGuardados: DraftItem[] = [];

      for (const item of items) {
        if (!item.included) {
          noGuardados.push(item);
          continue;
        }
        if (!isReady(item.values, s.fields)) {
          omitidos += 1;
          noGuardados.push(item);
          continue;
        }

        const payload = normalize(item.values, s.fields);
        try {
          if (s.esHabilidad) {
            await saveSkill.mutateAsync({
              name: String(payload["name"] ?? ""),
              category: String(payload["category"] || CATEGORIAS[0]),
              proficiency_level: String(payload["proficiency_level"] || NIVELES[1]),
              description: payload["description"] ? String(payload["description"]) : "",
            });
          } else {
            await saversPorTabla[s.table]!.mutateAsync({ values: payload });
          }
          guardados += 1;
          // Se guardó: no se vuelve a incluir en "restantes", así un reintento no lo duplica.
        } catch (err) {
          fallidos += 1;
          const mensaje = err instanceof Error ? err.message : String(err);
          if (!primerError) primerError = `${s.titulo} — "${s.renderTitle(item.values) || s.singular}": ${mensaje}`;
          console.error(`No se pudo guardar en ${s.table}:`, err);
          noGuardados.push(item); // se deja visible para que el usuario lo corrija y reintente.
        }
      }

      restantes[s.key] = noGuardados;
    }

    setDrafts(restantes);
    setGuardando(false);

    if (fallidos > 0) {
      toast.error(
        `Guardamos ${guardados} elementos, pero ${fallidos} no se pudieron guardar. ` +
          (primerError ? `Primer error: ${primerError}` : "Revisa los que quedaron abajo e inténtalo de nuevo."),
      );
      return; // se queda en la pantalla: solo faltan los que fallaron u omitieron.
    }

    if (omitidos > 0) {
      toast.success(`Guardamos ${guardados} elementos. Omitimos ${omitidos} por falta de datos obligatorios.`);
    } else {
      toast.success(`Guardamos ${guardados} elementos en tu hoja de vida.`);
    }
    navigate({ to: "/app/hoja-de-vida" });
  };

  if (isLoading || !listo) {
    return <p className="mx-auto max-w-2xl text-sm text-muted-foreground">Cargando los datos detectados…</p>;
  }

  if (!cvImport || cvImport["status"] !== "completed") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-muted-foreground">
          No encontramos datos listos para revisar de esta importación.
        </p>
        <Button asChild variant="outline">
          <Link to="/app/perfil/importar-cv">Volver a importar</Link>
        </Button>
      </div>
    );
  }

  const totalIncluidos = Object.values(drafts).reduce(
    (acc, items) => acc + items.filter((i) => i.included).length,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <PageHeader
        eyebrow="Paso 2 de 2"
        title="Revisa tu hoja de vida"
        description="Esto es lo que detectamos en tu CV. Desmarca o edita lo que no quieras guardar; nada se guarda hasta que presiones «Guardar»."
      />

      <div className="mt-9 space-y-5">
        {SECCIONES.map((s) => (
          <Section key={s.key} title={s.titulo}>
            <CvReviewList
              items={drafts[s.key] ?? []}
              onChange={(items) => setDrafts((d) => ({ ...d, [s.key]: items }))}
              fields={s.fields}
              singular={s.singular}
              renderTitle={s.renderTitle}
            />
          </Section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl justify-end gap-2 px-4 py-4">
          <Button asChild variant="ghost" type="button">
            <Link to="/app/hoja-de-vida">Omitir</Link>
          </Button>
          <Button onClick={guardarTodo} disabled={guardando || totalIncluidos === 0}>
            {guardando ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Guardar {totalIncluidos > 0 ? `(${totalIncluidos})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
