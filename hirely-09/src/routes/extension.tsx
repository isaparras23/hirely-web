import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanLine, UserRound, Check, X } from "lucide-react";

export const Route = createFileRoute("/extension")({
  head: () => ({
    meta: [
      { title: "Popup de la extensión — Hirely" },
      {
        name: "description",
        content: "Simulación del popup de la extensión de Hirely sobre una oferta de empleo.",
      },
      { property: "og:title", content: "Popup de la extensión — Hirely" },
      { property: "og:description", content: "Detecta y autocompleta formularios de postulación." },
    ],
  }),
  component: ExtensionDemo,
});

function ExtensionDemo() {
  const [detectado, setDetectado] = useState(false);
  return (
    <div className="min-h-screen bg-muted/60 p-6">
      {/* Página simulada de una bolsa de empleo */}
      <div className="mx-auto max-w-3xl surface-card p-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">jobs.ejemplo.com</p>
        <h1 className="mt-3 text-2xl font-bold">Frontend Developer — Nexa Studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">Bogotá · Híbrido · Tiempo completo</p>
        <div className="mt-6 space-y-3">
          {["Nombre completo", "Correo", "Años de experiencia", "Adjuntar CV"].map((campo) => (
            <div key={campo} className="rounded-lg border border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">{campo}: </span>
              {detectado ? (
                <span className="font-medium text-primary">
                  {campo === "Adjuntar CV" ? "CV_Frontend_Nexa.pdf" : "autocompletado"}
                </span>
              ) : (
                <span className="text-muted-foreground/60">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Popup flotante de la extensión */}
      <div className="fixed bottom-6 right-6 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
        <div className="flex items-center justify-between bg-ink px-4 py-2.5 text-primary-foreground">
          <span className="font-display text-sm font-semibold">Hirely</span>
          <Link to="/app" aria-label="Cerrar popup">
            <X className="size-4 opacity-80" />
          </Link>
        </div>
        <div className="space-y-1 px-4 py-4 text-sm">
          <p className="font-medium">
            {detectado ? "Formulario completado" : "Formulario detectable en esta página"}
          </p>
          <p className="text-xs text-muted-foreground">Perfil activo: tu perfil de Hirely</p>
          {detectado && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Check className="size-3" /> 4 campos llenados
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
          <button
            onClick={() => setDetectado(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            <ScanLine className="size-3.5" /> Detectar F.
          </button>
          <Link
            to="/app/perfil"
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            <UserRound className="size-3.5" /> Mi perfil
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/extension">← Volver a la app</Link>
        </Button>
      </div>
    </div>
  );
}
