import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export type ThemeMode = "light" | "dark" | "system";

/** Tema predeterminado de la app (sin sesión): modo claro + azul pastel. */
export const DEFAULT_ACCENT = "#6E9CF5";
export const DEFAULT_MODE: ThemeMode = "light";

/** Sugerencias de color de acento. La arquitectura acepta cualquier hex. */
export const ACCENT_PRESETS: { label: string; value: string }[] = [
  { label: "Azul pastel", value: "#6E9CF5" },
  { label: "Lavanda", value: "#8B7BF7" },
  { label: "Menta", value: "#4FB7A5" },
  { label: "Durazno", value: "#E8925C" },
  { label: "Rosa", value: "#E27BA8" },
];

/** Caché local por usuario: evita parpadeo, nunca se usa cuando no hay sesión. */
const cacheKey = (userId: string) => `hirely-theme:${userId}`;

type ThemeCtx = {
  mode: ThemeMode;
  accent: string;
  resolvedMode: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  setAccent: (hex: string) => void;
  saving: boolean;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function isValidHex(value: string) {
  return /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value.trim());
}

function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function apply(mode: ThemeMode, accent: string) {
  if (typeof document === "undefined") return;
  const dark = mode === "dark" || (mode === "system" && prefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.setProperty("--primary", accent);
  root.style.setProperty("--primary-foreground", dark ? "#14121c" : "#ffffff");
  root.style.setProperty(
    "--primary-soft",
    dark ? `color-mix(in oklab, ${accent} 28%, #16151c)` : `color-mix(in oklab, ${accent} 14%, white)`,
  );
  root.style.setProperty(
    "--primary-softer",
    dark ? `color-mix(in oklab, ${accent} 16%, #16151c)` : `color-mix(in oklab, ${accent} 7%, white)`,
  );
}

function readCache(userId: string): { mode: ThemeMode; accent: string } | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { mode?: ThemeMode; accent?: string };
    return {
      mode: parsed.mode ?? DEFAULT_MODE,
      accent: parsed.accent && isValidHex(parsed.accent) ? parsed.accent : DEFAULT_ACCENT,
    };
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [accent, setAccentState] = useState<string>(DEFAULT_ACCENT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Sin sesión: siempre tema predeterminado (landing, login, registro, etc.).
    if (!userId) {
      setModeState(DEFAULT_MODE);
      setAccentState(DEFAULT_ACCENT);
      apply(DEFAULT_MODE, DEFAULT_ACCENT);
      return;
    }

    // Con sesión: caché del propio usuario primero, luego su preferencia guardada.
    const cached = readCache(userId);
    if (cached) {
      setModeState(cached.mode);
      setAccentState(cached.accent);
      apply(cached.mode, cached.accent);
    } else {
      apply(DEFAULT_MODE, DEFAULT_ACCENT);
    }

    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("user_preferences")
        .select("theme_mode, accent_color")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      const nextMode = ((data?.theme_mode as ThemeMode | null) ?? DEFAULT_MODE) as ThemeMode;
      const nextAccent =
        data?.accent_color && isValidHex(data.accent_color) ? data.accent_color : DEFAULT_ACCENT;
      setModeState(nextMode);
      setAccentState(nextAccent);
      localStorage.setItem(cacheKey(userId), JSON.stringify({ mode: nextMode, accent: nextAccent }));
      apply(nextMode, nextAccent);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = async (nextMode: ThemeMode, nextAccent: string) => {
    if (!userId) return;
    localStorage.setItem(cacheKey(userId), JSON.stringify({ mode: nextMode, accent: nextAccent }));
    setSaving(true);
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        { user_id: userId, theme_mode: nextMode, accent_color: nextAccent },
        { onConflict: "user_id" },
      );
    if (error) console.error(error);
    setSaving(false);
  };

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    apply(m, accent);
    void persist(m, accent);
  };

  const setAccent = (hex: string) => {
    if (!isValidHex(hex)) return;
    setAccentState(hex);
    apply(mode, hex);
    void persist(mode, hex);
  };

  const resolvedMode: "light" | "dark" =
    mode === "dark" || (mode === "system" && prefersDark()) ? "dark" : "light";

  return (
    <Ctx.Provider value={{ mode, accent, resolvedMode, setMode, setAccent, saving }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
