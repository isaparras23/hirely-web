import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/test-signup")({
  component: TestSignup,
});

function TestSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const testSignup = async () => {
    setLoading(true);
    setLogs([]);
    setResult(null);
    addLog("🚀 Iniciando test de signup...");

    try {
      const testEmail = email.toLowerCase().trim();
      const testPassword = password.trim();

      addLog(`📧 Email: ${testEmail}`);
      addLog(`🔐 Contraseña: ${testPassword.length} caracteres`);

      addLog("⏳ Enviando solicitud a Supabase...");
      const startTime = Date.now();

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          // ✅ Desabilitar confirmación de email para evitar rate limit de Supabase
          emailRedirectTo: undefined,
          data: {
            full_name: "Test User",
            first_name: "Test",
            last_name: "User",
          },
        },
      });

      const duration = Date.now() - startTime;
      addLog(`✅ Respuesta recibida en ${duration}ms`);

      if (error) {
        addLog(`❌ ERROR: ${error.message}`);
        addLog(`📌 Código: ${error.code}`);
        addLog(`📌 Status: ${(error as any).status}`);
        setResult({ success: false, error: error.message });
        return;
      }

      if (data.session) {
        addLog("✅ Sesión iniciada automáticamente!");
        addLog("🎉 SIGNUP EXITOSO");
        setResult({ success: true, message: "Cuenta creada exitosamente" });
      } else {
        addLog("📧 Se envió email de confirmación");
        addLog("⏳ Esperando confirmación del usuario");
        setResult({ success: true, message: "Email de confirmación enviado" });
      }
    } catch (err) {
      addLog(`❌ ERROR NO CONTROLADO: ${String(err)}`);
      setResult({ success: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Test de Signup Simplificado</h1>

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email (ÚNICO cada vez)</label>
            <Input
              type="email"
              placeholder="test123@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña (min 8 caracteres)</label>
            <Input
              type="password"
              placeholder="Password123!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button onClick={testSignup} disabled={loading} className="w-full">
            {loading && <Loader2 className="size-4 animate-spin mr-2" />}
            {loading ? "Registrando..." : "Probar Signup"}
          </Button>
        </div>

        {logs.length > 0 && (
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg mb-6 font-mono text-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">📋 Logs en tiempo real:</h3>
              <button
                onClick={() => setLogs([])}
                className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600"
              >
                Limpiar
              </button>
            </div>
            <div className="space-y-1 max-h-64 overflow-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <h3 className={`font-bold ${result.success ? "text-green-900 dark:text-green-200" : "text-red-900 dark:text-red-200"}`}>
              {result.success ? "✅ Éxito" : "❌ Error"}
            </h3>
            <p className={`text-sm mt-2 ${result.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
              {result.message || result.error}
            </p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded text-sm">
          <p className="font-bold text-blue-900 dark:text-blue-200 mb-2">📌 Pasos:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-900 dark:text-blue-200">
            <li>Ingresa un email ÚNICO (diferente cada vez que pruebes)</li>
            <li>Ingresa una contraseña con min 8 caracteres</li>
            <li>Haz clic en "Probar Signup"</li>
            <li>Espera a ver el resultado</li>
            <li>Si hay error, copia los LOGS y comparte</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
