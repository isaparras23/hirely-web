import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Linkedin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/configuracion/canales")({
  head: () => ({
    meta: [
      { title: "Canales de comunicación — Hirely" },
      { name: "description", content: "Escríbenos por correo o redes sociales para recibir ayuda." },
      { property: "og:title", content: "Canales de comunicación — Hirely" },
      { property: "og:description", content: "Correo y redes sociales de Hirely." },
    ],
  }),
  component: Canales,
});

function Canales() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[28px] font-semibold">Canales de comunicación</h1>

      <section className="mt-8 surface-card p-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Correo
        </h2>
        <p className="mt-3 flex items-center gap-2 text-sm">
          <Mail className="size-4 text-primary" /> hola@hirely.app
        </p>
      </section>

      <section className="mt-5 surface-card p-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Redes sociales
        </h2>
        <div className="mt-3 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Linkedin className="size-4 text-primary" /> /hirely
          </p>
          <p className="flex items-center gap-2">
            <Instagram className="size-4 text-primary" /> @hirely.app
          </p>
        </div>
      </section>

      <Button asChild variant="ghost" className="mt-6">
        <Link to="/app/configuracion">Volver a configuración</Link>
      </Button>
    </div>
  );
}
