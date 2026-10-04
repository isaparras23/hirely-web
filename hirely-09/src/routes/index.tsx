import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import {
  FileText,
  Sparkles,
  Puzzle,
  ArrowRight,
  Check,
  Mail,
  Download,
  ScanLine,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hirely — Tu CV listo para cada vacante" },
      {
        name: "description",
        content:
          "Crea tu perfil, mantén tu hoja de vida al día y postula más rápido con Hirely.",
      },
      { property: "og:title", content: "Hirely — Tu CV listo para cada vacante" },
      {
        property: "og:description",
        content: "Perfil profesional, generador de CV y extensión para postular en un clic.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: FileText,
    title: "Un perfil, muchos CVs",
    text: "Llena tu perfil una vez y genera versiones adaptadas a cada oferta.",
  },
  {
    icon: Sparkles,
    title: "Generación asistida",
    text: "Sugerencias de redacción y formato listo para sistemas ATS.",
  },
  {
    icon: Puzzle,
    title: "Extensión de navegador",
    text: "Detecta formularios de postulación y los autocompleta por ti.",
  },
];

function HeroMockup() {
  const campos = [
    ["Nombre completo", "Tu nombre completo"],
    ["Correo", "tu@correo.com"],
    ["Años de experiencia", "3 años"],
    ["Adjuntar CV", "CV_Frontend_Nexa.pdf"],
  ];
  return (
    <div className="relative animate-rise">
      <div className="surface-card overflow-hidden shadow-lift">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate rounded-md bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
            jobs.ejemplo.com/frontend-developer
          </span>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-sm font-semibold">Formulario de postulación</p>
          {campos.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5"
            >
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              <span className="flex items-center gap-1.5 truncate text-xs font-medium text-foreground">
                <Check className="size-3.5 text-primary" /> {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-6 -right-2 w-56 rounded-2xl border border-border bg-card p-4 shadow-pop sm:-right-8">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
            <ScanLine className="size-3.5" />
          </span>
          <p className="text-xs font-semibold">Formulario detectado</p>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">12 campos encontrados</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-4/5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            <a className="rounded-lg px-3 py-2 transition-colors hover:text-foreground" href="#que-hace">
              Qué hace
            </a>
            <a className="rounded-lg px-3 py-2 transition-colors hover:text-foreground" href="#funciones">
              Funciones
            </a>
            <a className="rounded-lg px-3 py-2 transition-colors hover:text-foreground" href="#descargar">
              Descargar
            </a>
            <a className="rounded-lg px-3 py-2 transition-colors hover:text-foreground" href="#contacto">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/registro">Crear cuenta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="que-hace"
          className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-[1.05fr_1fr] md:pt-24"
        >
          <div className="animate-rise">
            <h1 className="max-w-2xl text-[40px] font-semibold leading-[1.05] tracking-tight md:text-[58px]">
              Deja de reescribir tu CV para cada vacante.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Hirely guarda tu experiencia, arma el CV correcto para cada oferta y llena los
              formularios de postulación por ti.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/registro">
                  Empezar <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/extension">Ver la extensión</Link>
              </Button>
            </div>
          </div>
          <HeroMockup />
        </section>

        <section id="funciones" className="border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Funciones
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="surface-card group p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-3">
          <div>
            <h3 className="text-base font-semibold">Cómo empezar</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Crea tu cuenta", "Completa tu perfil", "Sube o genera tu CV"].map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <Check className="size-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div id="descargar">
            <h3 className="text-base font-semibold">Qué incluye</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Perfil profesional editable</li>
              <li>Generador y almacenamiento de CV</li>
              <li>Extensión con autocompletado</li>
            </ul>
            <Button asChild variant="soft" size="sm" className="mt-5">
              <Link to="/extension">
                <Download className="size-4" /> Descargar la extensión
              </Link>
            </Button>
          </div>
          <div id="contacto">
            <h3 className="text-base font-semibold">Contacto</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ¿Tienes dudas? Escríbenos desde la sección de soporte dentro de la app.
            </p>
            <Button asChild variant="link" className="mt-2 h-auto px-0">
              <Link to="/app/configuracion/canales">
                <Mail className="size-4" /> Ir a soporte
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Hirely
      </footer>
    </div>
  );
}
