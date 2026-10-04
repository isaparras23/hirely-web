/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/components/layout";
import { CrudSection, type Field } from "@/components/crud-section";
import { useProfile, useUpdateProfile, type Row } from "@/lib/data";
import { friendlyError } from "@/lib/errors";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/perfil/editar")({
  head: () => ({
    meta: [
      { title: "Editar perfil — Hirely" },
      { name: "description", content: "Edita tus datos personales, de contacto y preferencias laborales en Hirely." },
      { property: "og:title", content: "Editar perfil — Hirely" },
      { property: "og:description", content: "Actualiza tus datos personales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditarPerfil,
});

export type Campo = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "number" | "select" | "checkbox" | "url" | "tel";
  options?: string[];
  placeholder?: string;
  half?: boolean;
};

export const GRUPOS: { titulo: string; campos: Campo[] }[] = [
  {
    titulo: "Información personal",
    campos: [
      { name: "first_name", label: "Nombres", half: true, placeholder: "Tu nombre" },
      { name: "last_name", label: "Apellidos", half: true, placeholder: "Tus apellidos" },
      { name: "birth_date", label: "Fecha de nacimiento", type: "date", half: true },
      { name: "nationality", label: "Nacionalidad", half: true },
      { name: "birth_city", label: "Ciudad de nacimiento", half: true },
      { name: "birth_country", label: "País de nacimiento", half: true },
      {
        name: "document_type",
        label: "Tipo de documento",
        type: "select",
        half: true,
        options: ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "DNI", "Otro"],
      },
      { name: "document_number", label: "Número de documento", half: true },
    ],
  },
  {
    titulo: "Contacto",
    campos: [
      { name: "phone", label: "Teléfono", type: "tel", half: true, placeholder: "+57 300 123 4567" },
      { name: "phone_secondary", label: "Teléfono alternativo", type: "tel", half: true },
      { name: "address", label: "Dirección" },
      { name: "current_city", label: "Ciudad actual", half: true },
      { name: "current_country", label: "País actual", half: true },
      { name: "linkedin_url", label: "LinkedIn", type: "url", half: true, placeholder: "https://linkedin.com/in/…" },
      { name: "website_url", label: "Sitio web", type: "url", half: true, placeholder: "https://…" },
      { name: "portfolio_url", label: "Portafolio", type: "url", half: true, placeholder: "https://…" },
    ],
  },
  {
    titulo: "Perfil profesional",
    campos: [
      { name: "headline", label: "Titular", placeholder: "Desarrolladora frontend con 4 años de experiencia" },
      { name: "current_occupation", label: "Ocupación actual", half: true },
      { name: "years_experience", label: "Años de experiencia", type: "number", half: true },
      { name: "professional_summary", label: "Resumen profesional", type: "textarea" },
      { name: "career_objective", label: "Objetivo profesional", type: "textarea" },
    ],
  },
  {
    titulo: "Preferencias laborales",
    campos: [
      { name: "desired_position", label: "Cargo deseado", half: true },
      { name: "desired_area", label: "Área de interés", half: true },
      {
        name: "work_modality",
        label: "Modalidad",
        type: "select",
        half: true,
        options: ["Presencial", "Remoto", "Híbrido"],
      },
      {
        name: "contract_type",
        label: "Tipo de contrato",
        type: "select",
        half: true,
        options: ["Indefinido", "Término fijo", "Prestación de servicios", "Prácticas", "Freelance"],
      },
      {
        name: "work_schedule",
        label: "Jornada",
        type: "select",
        half: true,
        options: ["Tiempo completo", "Medio tiempo", "Por horas", "Turnos"],
      },
      { name: "schedule_availability", label: "Disponibilidad horaria", half: true },
      { name: "available_from", label: "Disponible desde", type: "date", half: true },
      { name: "salary_expectation", label: "Expectativa salarial", type: "number", half: true },
      { name: "salary_currency", label: "Moneda", half: true, placeholder: "COP" },
      { name: "willing_to_travel", label: "Tengo disponibilidad para viajar", type: "checkbox" },
      { name: "willing_to_relocate", label: "Tengo disponibilidad para reubicarme", type: "checkbox" },
    ],
  },
];

const CAMPOS = GRUPOS.flatMap((g) => g.campos);

function desdePerfil(profile: Row | undefined): Row {
  const v: Row = {};
  for (const c of CAMPOS) {
    const raw = profile?.[c.name];
    v[c.name] = c.type === "checkbox" ? !!raw : raw == null ? "" : String(raw);
  }
  return v;
}

const URL_RE = /^https?:\/\/.+/i;

const ubicacionFields: Field[] = [
  { name: "city", label: "Ciudad", required: true, half: true, placeholder: "Bogotá" },
  { name: "country", label: "País", half: true, placeholder: "Colombia" },
];

const areaFields: Field[] = [
  { name: "area", label: "Área", required: true, half: true, placeholder: "Desarrollo de software" },
  { name: "years_experience", label: "Años de experiencia", type: "number", half: true },
];


function EditarPerfil() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const [values, setValues] = useState<Row>(() => desdePerfil(undefined));
  const [listo, setListo] = useState(false);

  // Carga los valores reales una sola vez, sin pisar lo que el usuario ya escribió.
  useEffect(() => {
    if (profile && !listo) {
      setValues(desdePerfil(profile));
      setListo(true);
    }
  }, [profile, listo]);

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!String(values["first_name"] ?? "").trim()) {
      toast.error("Los nombres son obligatorios.");
      return;
    }
    for (const c of CAMPOS) {
      const raw = String(values[c.name] ?? "").trim();
      if (c.type === "url" && raw && !URL_RE.test(raw)) {
        toast.error(`${c.label} debe empezar por http:// o https://`);
        return;
      }
      if (c.type === "number" && raw && (Number.isNaN(Number(raw)) || Number(raw) < 0)) {
        toast.error(`${c.label} debe ser un número válido.`);
        return;
      }
    }

    const payload: Row = {};
    for (const c of CAMPOS) {
      const raw = values[c.name];
      if (c.type === "checkbox") payload[c.name] = !!raw;
      else if (c.type === "number") payload[c.name] = raw === "" || raw == null ? null : Number(raw);
      else payload[c.name] = raw === "" || raw == null ? null : String(raw).trim() || null;
    }

    try {
      await update.mutateAsync(payload);
      toast.success("Perfil actualizado");
      navigate({ to: "/app/perfil" });
    } catch (err) {
      toast.error(friendlyError(err, "No pudimos guardar los cambios."));
    }
  };

  if (isLoading) {
    return <p className="mx-auto max-w-2xl text-sm text-muted-foreground">Cargando tu perfil…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-[28px] font-semibold">Edición de mi perfil</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Los cambios se guardan en tu cuenta cuando presionas «Guardar cambios».
      </p>

      <form className="mt-8 space-y-5" onSubmit={submit}>
        {GRUPOS.map((g) => (
          <Section key={g.titulo} title={g.titulo}>
            <div className="grid gap-4 sm:grid-cols-2">
              {g.campos.map((c) => (
                <div key={c.name} className={`space-y-2 ${c.half ? "" : "sm:col-span-2"}`}>
                  {c.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={!!values[c.name]}
                        onCheckedChange={(checked) => set(c.name, !!checked)}
                      />
                      {c.label}
                    </label>
                  ) : (
                    <>
                      <Label htmlFor={c.name}>
                        {c.name === "first_name" ? (
                          <>
                            {c.label} <span className="text-destructive">*</span>
                          </>
                        ) : (
                          c.label
                        )}
                      </Label>
                      {c.type === "textarea" ? (
                        <Textarea
                          id={c.name}
                          rows={3}
                          value={String(values[c.name] ?? "")}
                          placeholder={c.placeholder ?? ""}
                          onChange={(e) => set(c.name, e.target.value)}
                        />
                      ) : c.type === "select" ? (
                        <select
                          id={c.name}
                          value={String(values[c.name] ?? "")}
                          onChange={(e) => set(c.name, e.target.value)}
                          className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
                        >
                          <option value="">Selecciona…</option>
                          {(c.options ?? []).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={c.name}
                          type={c.type === "number" ? "number" : c.type === "date" ? "date" : c.type ?? "text"}
                          value={String(values[c.name] ?? "")}
                          placeholder={c.placeholder ?? ""}
                          onChange={(e) => set(c.name, e.target.value)}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ))}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button asChild variant="ghost" type="button">
            <Link to="/app/perfil">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={update.isPending}>
            {update.isPending && <Loader2 className="size-4 animate-spin" />} Guardar cambios
          </Button>
        </div>
      </form>

      <div className="mt-5 space-y-5">
        <CrudSection
          table="preferred_work_locations"
          title="Ubicaciones preferidas"
          description="Ciudades donde te gustaría trabajar. Se guardan al instante."
          singular="Ubicación"
          fields={ubicacionFields}
          renderTitle={(row) => String(row["city"] ?? "")}
          renderMeta={(row) => (row["country"] ? String(row["country"]) : null)}
        />

        <CrudSection
          table="profile_experience_areas"
          title="Áreas de experiencia"
          description="Áreas en las que tienes experiencia y cuántos años. Se guardan al instante."
          singular="Área"
          fields={areaFields}
          renderTitle={(row) => String(row["area"] ?? "")}
          renderMeta={(row) =>
            row["years_experience"] != null
              ? `${row["years_experience"]} ${Number(row["years_experience"]) === 1 ? "año" : "años"} de experiencia`
              : null
          }
        />
      </div>
    </div>
  );
}

