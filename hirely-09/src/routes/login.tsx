import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, GoogleIcon } from "@/components/brand";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/errors";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Hirely" },
      { name: "description", content: "Accede a tu cuenta de Hirely para gestionar tu hoja de vida." },
      { property: "og:title", content: "Iniciar sesión — Hirely" },
      { property: "og:description", content: "Accede a tu cuenta de Hirely." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/app", replace: true });
  }, [user, navigate]);

  const entrarConGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    });
    if (result.error) {
      toast.error("No se pudo iniciar sesión con Google.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/app" });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!correo.trim() || !pass) {
      setError("Escribe tu correo y tu contraseña.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: correo.trim().toLowerCase(),
      password: pass,
    });
    setLoading(false);
    if (signInError) {
      setError(friendlyError(signInError, "No pudimos iniciar sesión."));
      return;
    }
    toast.success("Sesión iniciada");
    void navigate({ to: "/app" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6 py-12">
      <div className="w-full max-w-sm surface-card p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Bienvenido de vuelta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ingresa para continuar.</p>

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
          <div className="space-y-2">
            <Label htmlFor="pass">Contraseña</Label>
            <Input
              id="pass"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}{" "}
              <Link to="/recuperar" className="underline underline-offset-2">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />} Iniciar sesión
          </Button>
        </form>

        <div className="mt-3 text-center">
          <Link
            to="/recuperar"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={entrarConGoogle}>
          <GoogleIcon className="mr-2" />
          Continuar con Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-primary underline-offset-4 hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
