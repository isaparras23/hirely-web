import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Chrome, ScanLine, UserRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/extension")({
  head: () => ({
    meta: [
      { title: "Extensión — Hirely" },
      { name: "description", content: "Instala la extensión de Hirely y autocompleta postulaciones." },
      { property: "og:title", content: "Extensión — Hirely" },
      { property: "og:description", content: "Autocompleta formularios de postulación en un clic." },
    ],
  }),
  component: Extension,
});

function Extension() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-[28px] font-semibold">Extensión de navegador</h1>
      <p className="mt-2 text-muted-foreground">
        Detecta formularios de postulación y los llena con tu perfil.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <section className="surface-card p-6">
          <h2 className="font-semibold">Instalación</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Obtén el paquete de la extensión.</li>
            <li>2. Actívala en tu navegador.</li>
            <li>3. Abre una oferta y pulsa "Detectar formulario".</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Función disponible próximamente")}>
              <Chrome className="size-4" /> Obtener paquete
            </Button>
            <Button asChild variant="outline">
              <Link to="/extension">Ver popup de la extensión</Link>
            </Button>
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-muted/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Vista previa
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-lift">
            <div className="bg-ink px-4 py-2 text-xs font-semibold text-primary-foreground">Hirely</div>
            <div className="space-y-2 p-4 text-xs text-muted-foreground">
              <p>Vacante detectada: Frontend Developer</p>
              <p>Perfil: tu perfil de Hirely</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border text-xs">
              <div className="flex items-center justify-center gap-1 py-2">
                <ScanLine className="size-3" /> Detectar F.
              </div>
              <div className="flex items-center justify-center gap-1 py-2">
                <UserRound className="size-3" /> Mi perfil
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
