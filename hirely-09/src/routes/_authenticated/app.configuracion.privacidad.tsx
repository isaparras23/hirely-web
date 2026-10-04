import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/configuracion/privacidad")({
  head: () => ({
    meta: [
      { title: "Datos y privacidad — Hirely" },
      { name: "description", content: "Cómo tratamos tus datos personales en Hirely." },
      { property: "og:title", content: "Datos y privacidad — Hirely" },
      { property: "og:description", content: "Política de tratamiento de datos." },
    ],
  }),
  component: Privacidad,
});

const parrafos = [
  "Hirely usa tus datos únicamente para construir tu perfil profesional y generar versiones de tu hoja de vida.",
  "No compartimos tu información con terceros con fines publicitarios. Puedes solicitar la eliminación de tus datos en cualquier momento.",
  "La extensión solo lee los formularios de postulación que abres para autocompletarlos con la información de tu perfil.",
];

function Privacidad() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[28px] font-semibold">Datos y privacidad</h1>
      <article className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground shadow-soft">
        {parrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </article>
      <Button asChild variant="ghost" className="mt-4">
        <Link to="/app/configuracion">Volver a configuración</Link>
      </Button>
    </div>
  );
}
