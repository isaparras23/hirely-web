import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";
import { friendlyError } from "@/lib/errors";

export const Route = createFileRoute("/_authenticated/app/configuracion/eliminar-cuenta")({
  head: () => ({
    meta: [
      { title: "Eliminar cuenta — Hirely" },
      { name: "description", content: "Elimina tu cuenta de Hirely y cuéntanos por qué te vas." },
      { property: "og:title", content: "Eliminar cuenta — Hirely" },
      { property: "og:description", content: "Elimina tu cuenta de Hirely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Eliminar,
});

function Eliminar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteAccount = useServerFn(deleteMyAccount);
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "ELIMINAR" || deleting) return;
    setDeleting(true);
    try {
      await deleteAccount({ data: { reason, confirmation: "ELIMINAR" } });
      await queryClient.cancelQueries();
      queryClient.clear();
      await navigate({ to: "/", replace: true });
      await supabase.auth.signOut({ scope: "local" });
      toast.success("Tu cuenta y tus datos fueron eliminados");
    } catch (error) {
      toast.error(friendlyError(error, "No pudimos eliminar tu cuenta. Inténtalo de nuevo."));
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="flex items-center gap-2 text-[28px] font-semibold">
        <AlertTriangle className="size-6 text-destructive" /> Eliminar cuenta
      </h1>
      <div className="mt-8 space-y-5 rounded-2xl border border-destructive/40 bg-card p-6 shadow-soft">
        <p className="text-sm leading-6 text-muted-foreground">
          Esta acción eliminará permanentemente tu perfil, hoja de vida, preferencias y archivos.
          No podrás recuperar la información después.
        </p>
        <Label htmlFor="motivo">¿Por qué deseas eliminar tu cuenta?</Label>
        <Textarea
          id="motivo"
          rows={4}
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Cuéntanos brevemente… (opcional)"
        />
        <div className="space-y-2">
          <Label htmlFor="confirmacion">
            Escribe <strong>ELIMINAR</strong> para continuar
          </Label>
          <Input
            id="confirmacion"
            autoComplete="off"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button asChild variant="ghost">
            <Link to="/app/configuracion">Cancelar</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={confirmation !== "ELIMINAR" || deleting}>
                <Trash2 /> Eliminar cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar tu cuenta definitivamente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se borrarán tus datos y archivos de Hirely. Esta acción es permanente y no se
                  puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Conservar mi cuenta</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleting}
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:brightness-[1.05]"
                >
                  {deleting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                  {deleting ? "Eliminando…" : "Sí, eliminar definitivamente"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
