import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError, MIN_PASSWORD_LENGTH } from "@/lib/errors";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nueva contraseña — Hirely" },
      { name: "description", content: "Crea una contraseña nueva para tu cuenta de Hirely." },
      { property: "og:title", content: "Nueva contraseña — Hirely" },
      { property: "og:description", content: "Crea una contraseña nueva." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [listo, setListo] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // El enlace del correo entrega una sesión de recuperación temporal.
  useEffect(() => {
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery");
    void supabase.auth.getSession().then(({ data }) => {
      setListo(!!data.session || isRecovery);
    });
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pass.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (pass !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: pass });
    setLoading(false);
    if (updateError) {
      setError(friendlyError(updateError, "No pudimos actualizar la contraseña."));
      return;
    }
    toast.success("Contraseña actualizada");
    void navigate({ to: "/app", replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6 py-12">
      <div className="w-full max-w-sm surface-card p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Nueva contraseña</h1>
        {listo ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Elige una contraseña de al menos {MIN_PASSWORD_LENGTH} caracteres.
            </p>
            <form className="mt-6 space-y-4" onSubmit={enviar}>
              <div className="space-y-2">
                <Label htmlFor="pass">Contraseña</Label>
                <Input
                  id="pass"
                  type="password"
                  autoComplete="new-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass2">Repite la contraseña</Label>
                <Input
                  id="pass2"
                  type="password"
                  autoComplete="new-password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                />
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />} Guardar contraseña
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Este enlace no es válido o ya caducó. Solicita uno nuevo desde la pantalla de
              recuperación.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to="/recuperar">Solicitar otro enlace</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
