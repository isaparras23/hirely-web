import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand";

export const Route = createFileRoute("/_authenticated/onboarding/datos")({
  head: () => ({
    meta: [
      { title: "Tus datos — Hirely" },
      { name: "description", content: "Ingresa tus nombres y apellidos para crear tu perfil en Hirely." },
      { property: "og:title", content: "Tus datos — Hirely" },
      { property: "og:description", content: "Nombres y apellidos para crear tu perfil." },
    ],
  }),
  component: DatosPage,
});

const campos = ["Primer nombre", "Segundo nombre", "Primer apellido", "Segundo apellido"];

function DatosPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-3xl px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-xl px-6 pb-20">
        <h1 className="text-2xl font-semibold tracking-tight">Cuéntanos quién eres</h1>
        <form
          className="mt-8 space-y-4 surface-card p-7"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/onboarding/perfil-creado" });
          }}
        >
          {campos.map((c) => (
            <div key={c} className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center">
              <Label htmlFor={c}>{c}</Label>
              <Input id={c} />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button asChild variant="ghost" type="button">
              <Link to="/bienvenida">Atrás</Link>
            </Button>
            <Button type="submit">Finalizar</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
