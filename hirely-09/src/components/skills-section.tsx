/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRow, useProfileSkills, useSaveSkill, type Row } from "@/lib/data";
import { friendlyError } from "@/lib/errors";
import { toast } from "sonner";

export const NIVELES = ["Básico", "Intermedio", "Avanzado", "Experto"];
export const CATEGORIAS = ["Técnica", "Blanda", "Herramienta", "Otra"];

export function SkillsSection() {
  const { data: rows = [], isLoading } = useProfileSkills();
  const save = useSaveSkill();
  const remove = useDeleteRow("profile_skills");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIAS[0]!);
  const [nivel, setNivel] = useState(NIVELES[1]!);
  const [descripcion, setDescripcion] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const start = (row?: Row) => {
    setEditing(row ?? null);
    setName(String(row?.["skills"]?.name ?? ""));
    setCategory(String(row?.["skills"]?.category ?? CATEGORIAS[0]));
    setNivel(String(row?.["proficiency_level"] ?? NIVELES[1]));
    setDescripcion(String(row?.["description"] ?? ""));
    setOpen(true);
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error('El campo "Habilidad" es obligatorio.');
      return;
    }
    try {
      await save.mutateAsync({
        ...(editing ? { id: editing["id"] as string } : {}),
        name: name.trim(),
        category,
        proficiency_level: nivel,
        description: descripcion.trim(),
      });
      toast.success(editing ? "Cambios guardados" : "Habilidad agregada");
      setOpen(false);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <section className="surface-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Habilidades</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Habilidades técnicas y blandas con tu nivel de dominio.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => start()}>
          <Plus className="size-4" /> Agregar
        </Button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-primary-softer/60 p-5 text-sm text-muted-foreground">
            Aún no has agregado habilidades. Empieza con el botón «Agregar».
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row["id"]} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    {row["skills"]?.name ?? "Habilidad"}
                    {row["proficiency_level"] && (
                      <Badge variant="secondary">{row["proficiency_level"]}</Badge>
                    )}
                  </div>
                  {row["skills"]?.category && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{row["skills"].category}</p>
                  )}
                  {row["description"] && (
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {row["description"]}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" aria-label="Editar" onClick={() => start(row)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Eliminar"
                    onClick={() => setConfirmId(row["id"] as string)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar habilidad" : "Agregar habilidad"}</DialogTitle>
            <DialogDescription>Los cambios se guardan en tu cuenta.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="skill-name">
                Habilidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-name"
                value={name}
                placeholder="React, Comunicación, Excel…"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill-cat">Categoría</Label>
              <select
                id="skill-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill-nivel">Nivel</Label>
              <select
                id="skill-nivel"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {NIVELES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="skill-desc">Descripción</Label>
              <Textarea
                id="skill-desc"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending && <Loader2 className="size-4 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta habilidad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer y se eliminará de tu hoja de vida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await remove.mutateAsync(confirmId!);
                  toast.success("Habilidad eliminada");
                } catch (e) {
                  toast.error(friendlyError(e));
                } finally {
                  setConfirmId(null);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
