import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/diagnostico")({
  component: Diagnostico,
});

function Diagnostico() {
  const [resultado, setResultado] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const probarConexion = async () => {
    setLoading(true);
    setResultado(null);

    try {
      console.clear();
      console.log("🔍 DIAGNÓSTICO DE SUPABASE - INICIANDO...");
      console.log("═".repeat(60));

      // 1. Verificar configuración
      console.log("📋 PASO 1: Verificar variables de entorno");
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      console.log("URL:", url);
      console.log("Key (primeros 30 chars):", key?.slice(0, 30));

      // 2. Obtener sesión actual
      console.log("\n📋 PASO 2: Obtener sesión actual");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("Sesión:", sessionData?.session ? "✅ Existe" : "❌ No existe");
      if (sessionError) console.error("Error:", sessionError);

      // 3. Listar usuarios (solo para ver si la BD funciona)
      console.log("\n📋 PASO 3: Probar conexión a base de datos");
      const { data: usuarios, error: dbError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
      console.log("Base de datos:", dbError ? "❌ Error" : "✅ Conecta");
      if (dbError) console.error("Error:", dbError);

      // 4. Probar signup con email único
      if (email) {
        console.log(`\n📋 PASO 4: Intentar signup con ${email}`);
        const testPassword = "TestPassword123!";

        // Ver todas las headers y detalles
        const startTime = performance.now();

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: testPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: "Test User",
              first_name: "Test",
              last_name: "User",
            },
          },
        });

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.log(`⏱️  Tiempo de respuesta: ${duration}ms`);
        console.log("\n✅ RESPUESTA COMPLETA:", {
          data: signupData,
          error: signupError ? {
            code: signupError.code,
            status: (signupError as any).status,
            message: signupError.message,
            fullError: signupError,
          } : null,
        });
      }

      console.log("\n" + "═".repeat(60));
      console.log("✅ DIAGNÓSTICO COMPLETADO");

      setResultado({
        url,
        keyPreview: key?.slice(0, 30),
        sessionExists: !!sessionData?.session,
        sessionError,
        dbConnected: !dbError,
        dbError,
        signupTested: !!email,
      });
    } catch (err) {
      console.error("❌ ERROR FATAL:", err);
      setResultado({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔍 Diagnóstico de Supabase</h1>

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email para probar signup</label>
            <Input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Usa un email DIFERENTE cada vez que pruebes
            </p>
          </div>

          <Button onClick={probarConexion} disabled={loading} className="w-full">
            {loading ? "Ejecutando diagnóstico..." : "Ejecutar Diagnóstico Completo"}
          </Button>
        </div>

        {resultado && (
          <div className="bg-white dark:bg-slate-800 border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">📊 Resultado</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>📌 Instrucciones:</strong>
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-900 dark:text-blue-200 mt-2 space-y-1">
            <li>Abre DevTools (F12) → Console</li>
            <li>Ingresa un email único (ej: test1234@gmail.com)</li>
            <li>Haz clic en "Ejecutar Diagnóstico Completo"</li>
            <li>Mira los logs COMPLETOS en la consola</li>
            <li>Copia TODO el contenido de la consola y comparte</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
