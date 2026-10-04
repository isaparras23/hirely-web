import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Puzzle, ArrowRight, FileText, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { useProfile, useProfileSkills, useRows } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "Inicio — Hirely" },
      { name: "description", content: "Tu inicio en Hirely: estado de tu perfil, hoja de vida y extensión." },
      { property: "og:title", content: "Inicio — Hirely" },
      { property: "og:description", content: "Estado de tu perfil y tu hoja de vida." },
    ],
  }),
  component: Home,
});

const cards = [
  {
    to: "/app/perfil",
    icon: Info,
    title: "Información",
    text: "Revisa y edita tus datos personales y de contacto.",
  },
  {
    to: "/app/extension",
    icon: Puzzle,
    title: "Extensión",
    text: "Instálala en Chrome, Edge, Windows o Mac.",
  },
] as const;

const CAMPOS_CLAVE = [
  "first_name",
  "last_name",
  "phone",
  "current_city",
  "headline",
  "professional_summary",
  "desired_position",
  "years_experience",
];

function fecha(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}

function Home() {
  const { data: profile, isLoading } = useProfile();
  const { data: educacion = [] } = useRows("education");
  const { data: experiencia = [] } = useRows("work_experience");
  const { data: habilidades = [] } = useProfileSkills();
  const { data: cvs = [] } = useRows("resumes");

  const completos = profile ? CAMPOS_CLAVE.filter((k) => !!profile[k]).length : 0;
  const secciones = [educacion.length, experiencia.length, habilidades.length].filter((n) => n > 0).length;
  const porcentaje = Math.round(((completos / CAMPOS_CLAVE.length) * 0.7 + (secciones / 3) * 0.3) * 100);

  const nombre = profile?.["first_name"] as string | undefined;
  const ultimoCv = cvs[0];

  const resumen = [
    { icon: Info, label: "Perfil", value: isLoading ? "…" : `${porcentaje}% completo` },
    {
      icon: FileText,
      label: "Hoja de vida",
      value: `${educacion.length + experiencia.length + habilidades.length} registros`,
    },
    {
      icon: CheckCircle2,
      label: "CV guardados",
      value: cvs.length === 0 ? "Ninguno aún" : `${cvs.length}`,
    },
    { icon: Clock, label: "Última actualización", value: fecha(profile?.["updated_at"] as string) },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={nombre ? `Hola ${nombre}` : "Bienvenido"}
        description={
          porcentaje >= 80
            ? "Tu perfil está listo para generar CVs."
            : "Completa tu perfil para aprovechar Hirely al máximo."
        }
      />

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resumen.map((r) => (
          <div key={r.label} className="surface-card p-5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <r.icon className="size-4" />
            </span>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{r.label}</p>
            <p className="mt-1 text-sm font-semibold">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 surface-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Progreso de tu perfil</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {ultimoCv
                ? `Último archivo: ${ultimoCv["file_name"]}`
                : "Aún no has subido ni generado un CV."}
            </p>
          </div>
          <span className="text-2xl font-semibold text-primary">{porcentaje}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/app/hoja-de-vida"
            className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary"
          >
            Completar hoja de vida
          </Link>
          <Link
            to="/app/perfil/importar-cv"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            Importar CV
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="surface-card group p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <c.icon className="size-5" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">{c.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Abrir
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
