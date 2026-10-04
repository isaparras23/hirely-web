import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { extractCvWithGemini } from "./gemini.server";

/**
 * Codifica un ArrayBuffer a base64 sin depender de Buffer (Node), para
 * que funcione igual si el proyecto termina desplegado en un runtime
 * tipo Cloudflare Workers que no trae Buffer por defecto.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Procesa un CV ya subido a Storage: lo descarga, lo manda a Gemini para
 * extraer la información y guarda el resultado en cv_imports.
 *
 * No escribe nada en profiles/education/work_experience/etc.: eso solo
 * ocurre cuando el usuario confirma la pantalla de revisión (fase
 * siguiente del plan). Aquí solo se deja la propuesta en cv_imports.
 */
export const extractCvData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        resumeId: z.string().uuid(),
        cvImportId: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const markFailed = async (message: string) => {
      await supabase
        .from("cv_imports")
        .update({
          status: "failed",
          error_message: message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", data.cvImportId);
    };

    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("id, file_path")
      .eq("id", data.resumeId)
      .maybeSingle();

    if (resumeError || !resume) {
      throw new Error("No encontramos el CV que intentas procesar.");
    }

    const { data: file, error: downloadError } = await supabase.storage
      .from("cvs")
      .download(resume.file_path);

    if (downloadError || !file) {
      const message = "No pudimos leer el archivo subido. Intenta subirlo de nuevo.";
      await markFailed(message);
      throw new Error(message);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const result = await extractCvWithGemini(base64);

    if (!result.ok) {
      await markFailed(result.error);
      throw new Error(result.error);
    }

    const nowIso = new Date().toISOString();

    const { error: updateImportError } = await supabase
      .from("cv_imports")
      .update({
        status: "completed",
        extracted_data: result.data,
        completed_at: nowIso,
      })
      .eq("id", data.cvImportId);

    if (updateImportError) {
      throw new Error("No pudimos guardar la información extraída. Inténtalo de nuevo.");
    }

    await supabase.from("resumes").update({ status: "processed" }).eq("id", data.resumeId);

    return result.data;
  });
