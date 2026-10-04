import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const code = url.searchParams.get("code");

        console.log("🔐 Callback URL:", window.location.href);
        console.log("🔐 Hash params:", Object.fromEntries(params.entries()));

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("❌ Error setSession:", sessionError);
            setError("No se pudo completar la autenticación con Google.");
            return;
          }
        } else if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("❌ Error exchangeCodeForSession:", exchangeError);
            setError("No se pudo completar la autenticación con Google.");
            return;
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();

        console.log("📝 getSession result:", data, sessionError);

        if (sessionError) {
          console.error("❌ Error al obtener sesión:", sessionError);
          setError("Error al obtener la sesión.");
          return;
        }

        if (data.session) {
          console.log("✅ Sesión recuperada correctamente. Redirigiendo a /app");
          window.location.href = "/app";
          return;
        }

        console.error("❌ No se recibió ningún valor de sesión en callback");
        setError("No se recibió una sesión válida.");
      } catch (err) {
        console.error("❌ Callback error:", err);
        setError("Error inesperado durante la autenticación.");
      } finally {
        setLoading(false);
      }
    };

    void handleCallback();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md px-4 text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Error de autenticación
          </h1>

          <p className="mt-4 text-muted-foreground">
            {error}
          </p>

          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Volver a intentar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Procesando autenticación...
        </p>
      </div>
    </div>
  );
}