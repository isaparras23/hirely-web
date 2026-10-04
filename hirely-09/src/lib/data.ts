/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export type Row = Record<string, any>;

const db = supabase as any;

/** Registra un evento relevante. Nunca guarda datos sensibles. */
export async function logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await db.from("activity_logs").insert({
      user_id: userId,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
    });
  } catch (e) {
    console.error("activity log", e);
  }
}

/** Nombre y apellido derivados de la identidad (registro por correo o Google). */
function nameFromIdentity(user: User) {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = String(meta["full_name"] ?? meta["name"] ?? "").trim();
  const parts = fullName ? fullName.split(/\s+/) : [];
  const firstName =
    ((meta["first_name"] ?? meta["given_name"]) as string | undefined) ?? parts[0] ?? null;
  const lastName =
    ((meta["last_name"] ?? meta["family_name"]) as string | undefined) ??
    (parts.length > 1 ? parts.slice(1).join(" ") : null);
  return { firstName: firstName || null, lastName: lastName || null };
}

/** Devuelve el perfil del usuario, creándolo si es su primera sesión. */
export async function ensureProfile(user: User): Promise<Row> {
  const existing = await db.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  const { firstName, lastName } = nameFromIdentity(user);

  if (existing.data) {
    const row = existing.data as Row;
    // Solo rellena huecos: un nombre editado manualmente nunca se sobrescribe.
    const patch: Row = {};
    if (!row["first_name"] && firstName) patch["first_name"] = firstName;
    if (!row["last_name"] && lastName) patch["last_name"] = lastName;
    if (Object.keys(patch).length) {
      const updated = await db.from("profiles").update(patch).eq("id", row["id"]).select().single();
      if (updated.data) return updated.data as Row;
    }
    return row;
  }


  const created = await db
    .from("profiles")
    .insert({ user_id: user.id, first_name: firstName, last_name: lastName })
    .select()
    .single();

  if (created.error) {
    const again = await db.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (again.data) return again.data as Row;
    throw created.error;
  }
  await logActivity(user.id, "profile_created", "profiles", created.data.id);
  return created.data as Row;
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => ensureProfile(user!),
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      const { data: profile } = await db.from("profiles").select("*").eq("user_id", user!.id).single();
      // Guarda una copia del estado anterior antes de sobrescribir.
      await db.from("profile_versions").insert({
        profile_id: profile.id,
        source: "manual_edit",
        snapshot: profile,
      });
      const { data, error } = await db
        .from("profiles")
        .update(values)
        .eq("user_id", user!.id)
        .select()
        .single();
      if (error) throw error;
      await logActivity(user!.id, "profile_updated", "profiles", data.id);
      return data as Row;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useRows(table: string) {
  const { data: profile } = useProfile();
  const profileId = profile?.["id"] as string | undefined;
  return useQuery({
    queryKey: [table, profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

export function useSaveRow(table: string) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: Row }) => {
      if (id) {
        const { data, error } = await db.from(table).update(values).eq("id", id).select().single();
        if (error) throw error;
        await logActivity(user!.id, `${table}_updated`, table, id);
        return data as Row;
      }
      const { data, error } = await db
        .from(table)
        .insert({ ...values, profile_id: profile?.["id"] })
        .select()
        .single();
      if (error) throw error;
      await logActivity(user!.id, `${table}_created`, table, data.id);
      return data as Row;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [table] });
    },
  });
}

export function useDeleteRow(table: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
      await logActivity(user!.id, `${table}_deleted`, table, id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [table] });
    },
  });
}

/** Habilidades del perfil junto con el catálogo compartido. */
export function useProfileSkills() {
  const { data: profile } = useProfile();
  const profileId = profile?.["id"] as string | undefined;
  return useQuery({
    queryKey: ["profile_skills", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await db
        .from("profile_skills")
        .select("*, skills(id, name, category)")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

export function useSaveSkill() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      category,
      proficiency_level,
      description,
    }: {
      id?: string;
      name: string;
      category: string;
      proficiency_level: string;
      description?: string;
    }) => {
      const cleanName = name.trim();
      const found = await db.from("skills").select("id").ilike("name", cleanName).maybeSingle();
      let skillId = found.data?.id as string | undefined;
      if (!skillId) {
        const inserted = await db
          .from("skills")
          .insert({ name: cleanName, category })
          .select("id")
          .single();
        if (inserted.error) throw inserted.error;
        skillId = inserted.data.id as string;
      }
      const values = { skill_id: skillId, proficiency_level, description: description ?? null };
      if (id) {
        const { error } = await db.from("profile_skills").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await db
          .from("profile_skills")
          .insert({ ...values, profile_id: profile?.["id"] });
        if (error) throw error;
      }
      await logActivity(user!.id, id ? "skill_updated" : "skill_created", "profile_skills", id ?? null);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile_skills"] });
    },
  });
}

/** Lee un registro de cv_imports (lo que la IA extrajo de un CV subido). */
export function useCvImport(id: string | undefined) {
  return useQuery({
    queryKey: ["cv_import", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await db.from("cv_imports").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Row;
    },
  });
}
