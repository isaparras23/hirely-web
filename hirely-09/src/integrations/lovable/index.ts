// OAuth con Supabase nativo - Sin dependencias de Lovable
import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  redirectTo?: string;
  extraParams?: Record<string, string>;
  queryParams?: Record<string, string>;
};

type OAuthProvider = "google" | "apple" | "microsoft";

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: OAuthProvider, opts?: SignInOptions) => {
      try {
        const redirectTarget = opts?.redirectTo ?? opts?.redirect_uri ?? `${window.location.origin}/auth/callback`;
        const queryParams = {
          prompt: "select_account",
          ...(opts?.queryParams ?? {}),
        };

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectTarget,
            queryParams,
          },
        });

        if (error) {
          return { error };
        }

        if (data?.url) {
          // Supabase OAuth siempre redirige
          window.location.href = data.url;
          return { redirected: true };
        }

        return { error: new Error("No OAuth URL received") };
      } catch (err) {
        return { error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
  },
};
