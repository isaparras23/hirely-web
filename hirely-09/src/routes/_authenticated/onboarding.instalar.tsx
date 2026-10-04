import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { Download, Puzzle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding/instalar")({
  head: () => ({
    meta: [
      { title: "Instalar extensión — Hirely" },
      { name: "description", content: "Dos pasos para instalar la extensión de Hirely en tu navegador." },
      { property: "og:title", content: "Instalar extensión — Hirely" },
      { property: "og:description", content: "Descarga el archivo e instala la extensión." },
    ],
  }),
  component: Instalar,
});

const pasos = [
  { icon: Download, title: "Descarga el archivo", text: "Guarda el paquete de la extensión en tu equipo." },
  { icon: Puzzle, title: "Instala la extensión", text: "Ábrela desde tu navegador y actívala." },
];

function Instalar() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-3xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-xl px-6 pb-20">
        <h1 className="text-[28px] font-semibold">Casi listo</h1>
        <ol className="mt-8 space-y-4">
          {pasos.map((p, i) => (
            <li
              key={p.title}
              className="flex gap-4 surface-card p-5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h2 className="flex items-center gap-2 font-semibold">
                  <p.icon className="size-4 text-primary" /> {p.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Button asChild className="mt-8">
          <Link to="/app">Continuar al inicio</Link>
        </Button>
      </main>
    </div>
  );
}
