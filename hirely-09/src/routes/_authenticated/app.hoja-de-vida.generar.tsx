import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/hoja-de-vida/generar")({
  head: () => ({
    meta: [
      { title: "Generar CV — Hirely" },
      { name: "description", content: "Personaliza y descarga un CV a partir de tu hoja de vida." },
      { property: "og:title", content: "Generar CV — Hirely" },
      { property: "og:description", content: "Personaliza y descarga tu CV." },
    ],
  }),
  component: GenerarCv,
});

function GenerarCv() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="flex items-center gap-2 text-[28px] font-semibold">
        <Sparkles className="size-6 text-accent" /> Generar CV
      </h1>
      <div className="mt-8 space-y-4 surface-card p-6">
        <div className="space-y-2">
          <Label htmlFor="personalizar">Personalizar</Label>
          <Input id="personalizar" placeholder="Ej. CV para vacante de Frontend en Nexa" />
        </div>
        <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Vista previa del CV
        </div>
        <div className="flex justify-end gap-2">
          <Button asChild variant="ghost">
            <Link to="/app/hoja-de-vida">Volver</Link>
          </Button>
          <Button onClick={() => toast("Función disponible próximamente")}>
            <Download className="size-4" /> Descargar
          </Button>
        </div>
      </div>
    </div>
  );
}
