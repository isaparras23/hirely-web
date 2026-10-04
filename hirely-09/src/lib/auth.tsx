import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true });

// Flag global para evitar múltiples inicializaciones
let authInitialized = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    // Solo inicializar una sola vez
    if (authInitialized) {
      console.log("🔐 AuthProvider ya inicializado, saltando");
      setLoading(false);
      return;
    }

    authInitialized = true;
    let isMounted = true;

    console.log("🔐 AuthProvider: Inicializando listener (PRIMERA VEZ)");

    // onAuthStateChange ya obtiene la sesión automáticamente en su primer emit
    // NO hacer getSession() - es redundante y causa rate limit
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!isMounted) return;

      console.log("🔐 Auth state changed:", event);
      setSession(next);
      setLoading(false);

      // Solo invalidar queries en eventos relevantes
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        console.log("🔄 Invalidando queries para evento:", event);
        router.invalidate();
        if (event !== "SIGNED_OUT") {
          queryClient.invalidateQueries();
        }
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [queryClient, router]);

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, loading }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}

/** Correo de la identidad autenticada: única fuente de verdad. */
export function useAuthEmail() {
  return useAuth().user?.email ?? null;
}
