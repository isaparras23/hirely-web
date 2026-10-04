import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { useProfile } from "@/lib/data";
import { UserRound, Upload, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bienvenida")({
  head: () => ({
    meta: [
      { title: "Hola — Hirely" },
      { name: "description", content: "Primeros pasos en Hirely: llena tu perfil o importa tu CV." },
      { property: "og:title", content: "Hola — Hirely" },
      { property: "og:description", content: "Llena tu perfil o importa tu CV para empezar." },
    ],
  }),
  component: Bienvenida,
});

function Bienvenida() {
  const { data: profile } = useProfile();
  const nombre = (profile?.["first_name"] as string | undefined)?.trim();
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-4xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-6">
        <h1 className="text-[40px] font-semibold leading-tight md:text-[52px]">{nombre ? `Hola ${nombre}` : "Bienvenido"} 👋</h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Para generar tu hoja de vida necesitamos conocerte. Elige por dónde quieres empezar.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            to="/app/perfil/editar"
            className="group surface-card p-7 transition-shadow hover:shadow-lift"
          >
            <UserRound className="size-7 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Llenar perfil</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Completa tus datos personales y profesionales en Mi Perfil.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Empezar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/onboarding/importar-cv"
            className="group surface-card p-7 transition-shadow hover:shadow-lift"
          >
            <Upload className="size-7 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Importar CV</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sube un PDF existente y lo usamos para prellenar tu perfil.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Subir archivo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <Button asChild variant="ghost" className="mt-8">
          <Link to="/app">Omitir por ahora</Link>
        </Button>
      </main>
    </div>
  );
}
