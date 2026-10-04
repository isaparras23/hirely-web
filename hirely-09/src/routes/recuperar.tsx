import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/errors";

export const Route = createFileRoute("/recuperar")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña — Hirely" },
      { name: "description", content: "Te enviamos un correo para restablecer la contraseña de tu cuenta de Hirely." },
      { property: "og:title", content: "Recuperar contraseña — Hirely" },
      { property: "og:description", content: "Restablece la contraseña de tu cuenta." },
    ],
  }),
  component: RecuperarPage,
});

function RecuperarPage() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!correo.trim()) {
      setError("Escribe el correo con el que te registraste.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      correo.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password` },
    );
    setLoading(false);
    if (resetError) {
      setError(friendlyError(resetError, "No pudimos enviar el correo."));
      return;
    }
    setEnviado(true);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6 py-12">
      <div className="w-full max-w-sm surface-card p-8">
        <Logo />
        {enviado ? (
          <>
            <span className="mt-6 grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <MailCheck className="size-5" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Revisa tu correo</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Si existe una cuenta con <strong>{correo}</strong>, te enviamos un enlace para crear una
              contraseña nueva. El enlace caduca en poco tiempo.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to="/login">Volver a iniciar sesión</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Te enviaremos un enlace para crear una contraseña nueva.
            </p>
            <form className="mt-6 space-y-4" onSubmit={enviar}>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />} Enviar enlace
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
