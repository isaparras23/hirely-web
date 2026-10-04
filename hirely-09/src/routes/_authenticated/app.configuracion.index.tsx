import { createFileRoute, Link } from "@tanstack/react-router";
import { Palette, HelpCircle, MessageSquare, ShieldCheck, Trash2, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout";

export const Route = createFileRoute("/_authenticated/app/configuracion/")({
  head: () => ({
    meta: [
      { title: "Configuración — Hirely" },
      { name: "description", content: "Tema, preguntas frecuentes, contacto, privacidad y cuenta." },
      { property: "og:title", content: "Configuración — Hirely" },
      { property: "og:description", content: "Tema, ayuda, privacidad y cuenta." },
    ],
  }),
  component: Configuracion,
});

const items = [
  { to: "/app/configuracion/tema", icon: Palette, label: "Tema" },
  { to: "/app/configuracion/preguntas", icon: HelpCircle, label: "Preguntas frecuentes" },
  { to: "/app/configuracion/canales", icon: MessageSquare, label: "Canales de comunicación" },
  { to: "/app/configuracion/privacidad", icon: ShieldCheck, label: "Política de tratamiento de datos y privacidad" },
  { to: "/app/configuracion/eliminar-cuenta", icon: Trash2, label: "Eliminar cuenta" },
];

function Configuracion() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración" description="Personaliza Hirely y gestiona tu cuenta." />
      <div className="surface-card mt-9 divide-y divide-border overflow-hidden p-0">
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className="group flex items-center gap-3.5 px-5 py-4 text-sm transition-colors hover:bg-muted/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <i.icon className="size-4" />
            </span>
            <span className="flex-1 font-medium">{i.label}</span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
