import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/layout";
import { ACCENT_PRESETS, isValidHex, useTheme, type ThemeMode } from "@/lib/theme";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/configuracion/tema")({
  head: () => ({
    meta: [
      { title: "Tema y apariencia — Hirely" },
      { name: "description", content: "Elige el modo claro u oscuro y el color de acento de tu cuenta." },
      { property: "og:title", content: "Tema y apariencia — Hirely" },
      { property: "og:description", content: "Modo claro/oscuro y color de acento." },
    ],
  }),
  component: TemaPage,
});

const MODES: { value: ThemeMode; label: string; hint: string }[] = [
  { value: "light", label: "Claro", hint: "Fondo blanco, ideal de día" },
  { value: "dark", label: "Oscuro", hint: "Menos brillo, ideal de noche" },
  { value: "system", label: "Automático", hint: "Sigue la configuración del equipo" },
];

function TemaPage() {
  const { mode, accent, setMode, setAccent } = useTheme();
  const [custom, setCustom] = useState(accent);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Tema y apariencia"
        description="Tus preferencias se guardan en tu cuenta y te acompañan en cualquier equipo."
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/configuracion">
              <ArrowLeft className="size-4" /> Volver
            </Link>
          </Button>
        }
      />

      <div className="mt-9 space-y-5">
        <Section title="Modo de color">
          <div className="grid gap-3 sm:grid-cols-3">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  mode === m.value ? "border-primary bg-primary-softer" : "border-border hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {m.label}
                  {mode === m.value && <Check className="size-4 text-primary" />}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{m.hint}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Color de acento">
          <div className="flex flex-wrap gap-3">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                aria-label={preset.label}
                onClick={() => {
                  setAccent(preset.value);
                  setCustom(preset.value);
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  accent.toLowerCase() === preset.value.toLowerCase()
                    ? "border-primary bg-primary-softer"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span
                  className="size-4 rounded-full"
                  style={{ backgroundColor: preset.value }}
                  aria-hidden="true"
                />
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[13rem_1fr] sm:items-center">
            <Label htmlFor="hex" className="text-sm font-normal text-muted-foreground">
              Color personalizado
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                id="hex"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="max-w-40"
                placeholder="#8B7BF7"
              />
              <input
                type="color"
                aria-label="Selector de color"
                value={isValidHex(custom) ? custom : accent}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setAccent(e.target.value);
                }}
                className="size-9 cursor-pointer rounded-lg border border-border bg-background"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!isValidHex(custom)) {
                    toast.error("Escribe un color en formato hexadecimal, por ejemplo #8B7BF7.");
                    return;
                  }
                  setAccent(custom);
                  toast.success("Color de acento actualizado");
                }}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </Section>

        <Section title="Vista previa">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Botón principal</Button>
            <Button variant="outline">Secundario</Button>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              Etiqueta de acento
            </span>
          </div>
        </Section>
      </div>
    </div>
  );
}
