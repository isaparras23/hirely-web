import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        reason: z.string().trim().max(1000),
        confirmation: z.literal("ELIMINAR"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!process.env['SUPABASE_SERVICE_ROLE_KEY']) {
      throw new Error(
        "Falta la clave de servicio de Supabase (SUPABASE_SERVICE_ROLE_KEY). Añádela al .env y reinicia el servidor para poder eliminar la cuenta."
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, avatar_path")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (profileError) throw new Error("No se pudo preparar la eliminación de la cuenta.");

    const storageFiles: { bucket: string; path: string }[] = [];
    if (profile?.avatar_path) storageFiles.push({ bucket: "avatars", path: profile.avatar_path });

    if (profile) {
      const [{ data: resumes, error: resumesError }, { data: certifications, error: certificationsError }, { data: courses, error: coursesError }] =
        await Promise.all([
          supabaseAdmin.from("resumes").select("file_path").eq("profile_id", profile.id),
          supabaseAdmin
            .from("certifications")
            .select("certificate_path")
            .eq("profile_id", profile.id),
          supabaseAdmin.from("courses").select("certificate_path").eq("profile_id", profile.id),
        ]);

      if (resumesError || certificationsError || coursesError) {
        throw new Error("No se pudo preparar la eliminación de los archivos de la cuenta.");
      }

      for (const row of resumes ?? []) {
        if (row.file_path) storageFiles.push({ bucket: "cvs", path: row.file_path });
      }
      for (const row of [...(certifications ?? []), ...(courses ?? [])]) {
        if (row.certificate_path) {
          storageFiles.push({ bucket: "certificates", path: row.certificate_path });
        }
      }
    }

    for (const bucket of ["avatars", "cvs", "certificates"] as const) {
      const paths = [...new Set(storageFiles.filter((file) => file.bucket === bucket).map((file) => file.path))];
      if (paths.length === 0) continue;
      const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
      if (error) throw new Error("No se pudieron eliminar los archivos de la cuenta.");
    }

    if (data.reason) {
      const { error } = await supabaseAdmin.from("activity_logs").insert({
        user_id: context.userId,
        action: "account_deletion_requested",
        entity_type: "account",
        metadata: { reason: data.reason },
      });
      if (error) throw new Error("No se pudo registrar la solicitud de eliminación.");
    }

    if (profile) {
      const { error } = await supabaseAdmin.from("profiles").delete().eq("id", profile.id);
      if (error) throw new Error("No se pudieron eliminar los datos del perfil.");
    }

    for (const table of ["user_preferences", "support_requests", "activity_logs"] as const) {
      const { error } = await supabaseAdmin.from(table).delete().eq("user_id", context.userId);
      if (error) throw new Error("No se pudieron eliminar todos los datos de la cuenta.");
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (authError) throw new Error("No se pudo eliminar la cuenta. Inténtalo de nuevo.");

    return { deleted: true };
  });