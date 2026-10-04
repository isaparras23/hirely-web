import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { CheckCircle2, Chrome, Monitor } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding/perfil-creado")({
  head: () => ({
    meta: [
      { title: "Perfil creado — Hirely" },
      { name: "description", content: "Tu perfil de Hirely fue creado. Instala la extensión para postular más rápido." },
      { property: "og:title", content: "Perfil creado — Hirely" },
      { property: "og:description", content: "Instala la extensión para autocompletar postulaciones." },
    ],
  }),
  component: PerfilCreado,
});

function PerfilCreado() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-3xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-xl px-6 pb-20">
        <CheckCircle2 className="size-10 text-primary" />
        <h1 className="mt-4 text-[28px] font-semibold">
          Perfil creado correctamente
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ahora instala la extensión para autocompletar formularios de postulación.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Button asChild variant="outline" className="h-auto justify-start gap-3 py-4">
            <Link to="/onboarding/instalar">
              <Chrome className="size-5" /> Chrome
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-3 py-4">
            <Link to="/onboarding/instalar">
              <Monitor className="size-5" /> Windows
            </Link>
          </Button>
        </div>
        <Button asChild variant="ghost" className="mt-6">
          <Link to="/app">Ir al inicio</Link>
        </Button>
      </main>
    </div>
  );
}
