/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Section, PageHeader } from "@/components/layout";
import { GRUPOS } from "@/routes/_authenticated/app.perfil.editar";
import { useProfile, useUpdateProfile, useCvImport, type Row } from "@/lib/data";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/perfil/importar-cv/revisar/$cvImportId")({
  head: () => ({
    meta: [
      { title: "Revisar datos importados — Hirely" },
      { name: "description", content: "Revisa y ajusta los datos de tu perfil detectados desde tu CV." },
      { property: "og:title", content: "Revisar datos importados — Hirely" },
      { property: "og:description", content: "Confirma los datos de tu perfil antes de guardarlos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RevisarPerfilImportado,
});

const CAMPOS = GRUPOS.flatMap((g) => g.campos);
const URL_RE = /^https?:\/\/.+/i;

function desdePerfil(profile: Row | undefined): Row {
  const v: Row = {};
  for (const c of CAMPOS) {
    const raw = profile?.[c.name];
    v[c.name] = c.type === "checkbox" ? !!raw : raw == null ? "" : String(raw);
  }
  return v;
}

/** Superpone los datos detectados por la IA sobre el perfil actual (la IA gana solo donde trae un valor). */
function mergeConExtraido(base: Row, extraidoPerfil: Row | undefined): Row {
  if (!extraidoPerfil) return base;
  const v: Row = { ...base };
  for (const c of CAMPOS) {
    const raw = extraidoPerfil[c.name];
    if (raw != null && String(raw).trim() !== "") {
      v[c.name] = String(raw);
    }
  }
  return v;
}

function RevisarPerfilImportado() {
  const { cvImportId } = Route.useParams();
  const navigate = useNavigate();
  const { data: profile, isLoading: cargandoPerfil } = useProfile();
  const { data: cvImport, isLoading: cargandoImport } = useCvImport(cvImportId);
  const update = useUpdateProfile();
  const [values, setValues] = useState<Row>(() => desdePerfil(undefined));
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (profile && cvImport && !listo) {
      const extraido = (cvImport["extracted_data"] as Row | null)?.["profile"] as Row | undefined;
      setValues(mergeConExtraido(desdePerfil(profile), extraido));
      setListo(true);
    }
  }, [profile, cvImport, listo]);

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
      toast.success("Perfil actualizado con los datos de tu CV");
      navigate({
        to: "/app/hoja-de-vida/revisar-importacion/$cvImportId",
        params: { cvImportId },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos guardar los cambios.");
    }
  };

  if (cargandoPerfil || cargandoImport) {
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

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Paso 1 de 2"
        title="Revisa tu perfil"
        description="Detectamos esta información en tu CV. Ajusta lo que necesites antes de guardar; nada se modifica hasta que confirmes."
      />

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary-softer/60 p-4 text-sm text-muted-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>Los campos con datos detectados por la IA ya vienen llenos. Tú decides qué guardar.</p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={submit}>
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
            {update.isPending && <Loader2 className="size-4 animate-spin" />} Guardar y continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
