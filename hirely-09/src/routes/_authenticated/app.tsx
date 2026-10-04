import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/brand";
import { UserRound, FileText, Settings, LogOut, Puzzle, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Inicio", icon: Home, exact: true },
  { to: "/app/perfil", label: "Mi perfil", icon: UserRound, exact: false },
  { to: "/app/hoja-de-vida", label: "Mi hoja de vida", icon: FileText, exact: false },
  { to: "/app/extension", label: "Extensión", icon: Puzzle, exact: false },
] as const;

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-muted hover:text-foreground";
const itemActive = "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft";

function AppLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const nombre = [profile?.["first_name"], profile?.["last_name"]].filter(Boolean).join(" ");
  const iniciales = (nombre || user?.email || "?").slice(0, 1).toUpperCase();

  const salir = async () => {
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut({ scope: "global" });
      toast.success("Sesión cerrada");
      void navigate({ to: "/login", replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("No se pudo cerrar la sesión.");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <div className="px-2">
          <Logo to="/app" />
        </div>
        <nav className="mt-9 flex flex-1 flex-col gap-1">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
            Espacio
          </p>
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: itemActive }}
              className={itemBase}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-sidebar-border pt-4">
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              {iniciales}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{nombre || "Tu cuenta"}</span>
              <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
            </span>
          </div>
          <Link
            to="/app/configuracion"
            activeProps={{ className: itemActive }}
            className={itemBase}
          >
            <Settings className="size-[18px]" /> Configuración
          </Link>
          <button onClick={salir} className={`${itemBase} w-full text-left`}>
            <LogOut className="size-[18px]" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-5 py-3 backdrop-blur md:hidden">
          <Logo to="/app" />
          <button onClick={salir} className="text-sm text-muted-foreground">
            Salir
          </button>
        </header>
        <nav className="sticky top-[57px] z-10 flex gap-1.5 overflow-x-auto border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur md:hidden">
          {[
            ...nav.map((n) => ({ to: n.to, label: n.label })),
            { to: "/app/configuracion", label: "Configuración" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 px-5 py-9 md:px-12 md:py-12">
          <div className="animate-rise">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
