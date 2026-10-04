// Uso: node scripts/listar-modelos-gemini.mjs
//
// Lista los modelos de Gemini realmente disponibles para tu clave de API
// (GEMINI_API_KEY en .env), y cuáles soportan generateContent (los que sirven
// para extraer datos de un CV). Sirve para no adivinar nombres de modelo:
// gemini-2.0-flash, por ejemplo, ya no existe (Google lo retiró).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

const envContent = readFileSync(envPath, "utf-8");
const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
if (!match) {
  console.error("No encontré GEMINI_API_KEY en .env");
  process.exit(1);
}
const apiKey = match[1].trim();

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
if (!res.ok) {
  console.error("Error al listar modelos:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const modelos = (data.models ?? [])
  .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
  .map((m) => m.name.replace("models/", ""));

console.log("Modelos disponibles con generateContent para tu clave de API:");
for (const m of modelos) console.log(" -", m);
