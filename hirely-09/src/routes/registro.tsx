import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo, GoogleIcon } from "@/components/brand";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError, MIN_PASSWORD_LENGTH } from "@/lib/errors";
import { toast } from "sonner";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Hirely" },
      { name: "description", content: "Crea tu cuenta de Hirely y arma tu perfil profesional." },
      { property: "og:title", content: "Crear cuenta — Hirely" },
      { property: "og:description", content: "Crea tu cuenta y arma tu perfil profesional." },
    ],
  }),
  component: RegistroPage,
});

function RegistroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [acepta, setAcepta] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [puedeEnviar, setPuedeEnviar] = useState(true);

  useEffect(() => {
    if (user && !confirmar) void navigate({ to: "/bienvenida", replace: true });
  }, [user, confirmar, navigate]);

  const entrarConGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    });
    if (result.error) {
      toast.error("No se pudo continuar con Google.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/bienvenida" });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔒 Proteger contra clics múltiples
    if (!puedeEnviar || loading) {
      setError("Por favor espera a que termine la solicitud anterior.");
      return;
    }
    
    setError(null);
    
    if (!nombre.trim()) return setError("Escribe tu nombre.");
    if (!correo.trim()) return setError("Escribe tu correo.");
    if (pass.length < MIN_PASSWORD_LENGTH)
      return setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    if (!acepta) return setError("Debes aceptar los términos y la política de privacidad.");

    // Bloquear nuevos clics mientras se procesa
    setPuedeEnviar(false);
    setLoading(true);
    
    try {
      console.log("📝 Iniciando signup...");
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: correo.trim().toLowerCase(),
        password: pass,
        options: {
          // ✅ Desabilitar confirmación de email para evitar rate limit de Supabase
          emailRedirectTo: undefined,
          data: {
            full_name: nombre.trim(),
            first_name: nombre.trim().split(/\s+/)[0],
            last_name: nombre.trim().split(/\s+/).slice(1).join(" ") || null,
          },
        },
      });
      
      if (signUpError) {
        console.error("❌ Error de Supabase:", {
          code: signUpError.code,
          status: (signUpError as any).status,
          message: signUpError.message,
        });
        const detalle = signUpError.message ? ` (${signUpError.message})` : "";
        setError(friendlyError(signUpError, `No pudimos crear la cuenta.${detalle}`));
        setPuedeEnviar(true); // Permitir reintentar
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        console.log("✅ Cuenta creada - Esperando confirmación de email");
        setConfirmar(true);
        setLoading(false);
        return;
      }
      
      console.log("✅ Cuenta creada y sesión iniciada automáticamente");
      toast.success("Cuenta creada correctamente");
      setLoading(false);
      void navigate({ to: "/bienvenida" });
    } catch (err) {
      console.error("❌ Error no controlado:", err);
      setError("Error inesperado. Revisa la consola.");
      setPuedeEnviar(true);
      setLoading(false);
    }
  };

  if (confirmar) {
    return (
      <div className="grid min-h-screen place-items-center bg-hero px-6 py-12">
        <div className="w-full max-w-sm surface-card p-8">
          <Logo />
          <span className="mt-6 grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <MailCheck className="size-5" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Confirma tu correo</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Enviamos un enlace de confirmación a <strong>{correo}</strong>. Ábrelo para activar tu
            cuenta y luego inicia sesión.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/login">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-6 py-12">
      <div className="w-full max-w-sm surface-card p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Toma menos de un minuto.</p>

        <form className="mt-6 space-y-4" onSubmit={enviar}>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={acepta}
              onCheckedChange={(c) => setAcepta(!!c)}
              className="mt-0.5"
            />
            Acepto los términos y la política de privacidad.
          </label>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading || !puedeEnviar}>
            {loading && <Loader2 className="size-4 animate-spin" />} Crear cuenta
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={entrarConGoogle}>
          <GoogleIcon className="mr-2" />
          Continuar con Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
