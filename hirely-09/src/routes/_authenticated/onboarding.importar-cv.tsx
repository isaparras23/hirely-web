import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { UploadCloud } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding/importar-cv")({
  head: () => ({
    meta: [
      { title: "Importar CV — Hirely" },
      { name: "description", content: "Sube tu CV en PDF y Hirely prellena tu perfil profesional." },
      { property: "og:title", content: "Importar CV — Hirely" },
      { property: "og:description", content: "Sube tu CV en PDF para prellenar tu perfil." },
    ],
  }),
  component: ImportarCvPage,
});

function ImportarCvPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-3xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-xl px-6 pb-20 text-center">
        <h1 className="text-[28px] font-semibold">Importar CV</h1>
        <label className="mt-8 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-primary-softer p-12 text-sm text-muted-foreground transition-colors hover:border-primary/50">
          <UploadCloud className="size-8 text-primary" />
          Arrastra tu PDF o haz clic para seleccionarlo
          <input type="file" className="hidden" />
        </label>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/bienvenida">Atrás</Link>
          </Button>
          <Button onClick={() => navigate({ to: "/onboarding/datos" })}>Continuar</Button>
        </div>
      </main>
    </div>
  );
}
