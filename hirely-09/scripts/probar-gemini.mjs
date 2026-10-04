// Uso: node scripts/probar-gemini.mjs
//
// Prueba mínima y barata (sin PDF, un prompt de texto corto) contra el modelo
// que usa Hirely ahora mismo, para ver el código y el mensaje de error REAL
// que devuelve Gemini, en vez de adivinar por qué falla.
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

const modelo = process.argv[2] || "gemini-2.5-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;

console.log(`Probando modelo: ${modelo}`);
console.log(`URL: ${url}\n`);

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": apiKey,
  },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: "Responde solo con la palabra: hola" }] }],
  }),
});

console.log("HTTP status:", res.status);
const texto = await res.text();
console.log("Cuerpo de la respuesta:");
console.log(texto);
