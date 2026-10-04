/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useDeleteRow, useRows, useSaveRow, type Row } from "@/lib/data";
import { friendlyError } from "@/lib/errors";
import { toast } from "sonner";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "number" | "select" | "checkbox" | "url" | "email" | "tel";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  half?: boolean;
  hideIf?: (values: Row) => boolean;
};

export function formatDate(value?: string | null) {
  if (!value) return null;
  const [y, m] = value.split("-");
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const idx = Number(m) - 1;
  return `${months[idx] ?? ""} ${y}`.trim();
}

export function CrudSection({
  table,
  title,
  description,
  singular,
  fields,
  renderTitle,
  renderMeta,
  renderBody,
}: {
  table: string;
  title: string;
  description?: string;
  singular: string;
  fields: Field[];
  renderTitle: (row: Row) => ReactNode;
  renderMeta?: (row: Row) => ReactNode;
  renderBody?: (row: Row) => ReactNode;
}) {
  const { data: rows = [], isLoading } = useRows(table);
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Row>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const start = (row?: Row) => {
    setEditing(row ?? null);
    const initial: Row = {};
    for (const f of fields) initial[f.name] = row?.[f.name] ?? (f.type === "checkbox" ? false : "");
    setValues(initial);
    setOpen(true);
  };

  const submit = async () => {
    for (const f of fields) {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        toast.error(`El campo "${f.label}" es obligatorio.`);
        return;
      }
    }
    const payload: Row = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (f.type === "checkbox") payload[f.name] = !!raw;
      else if (f.type === "number") payload[f.name] = raw === "" || raw == null ? null : Number(raw);
      else payload[f.name] = raw === "" || raw == null ? null : String(raw).trim();
    }
    try {
      await save.mutateAsync({ ...(editing ? { id: editing["id"] as string } : {}), values: payload });
      toast.success(editing ? "Cambios guardados" : `${singular} agregado`);
      setOpen(false);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <section className="surface-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
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
            Aún no has agregado {title.toLowerCase()}. Empieza con el botón «Agregar».
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row["id"]} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{renderTitle(row)}</p>
                  {renderMeta && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{renderMeta(row)}</p>
                  )}
                  {renderBody && (
                    <div className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {renderBody(row)}
                    </div>
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar ${singular.toLowerCase()}` : `Agregar ${singular.toLowerCase()}`}</DialogTitle>
            <DialogDescription>Los cambios se guardan en tu cuenta.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields
              .filter((f) => !f.hideIf?.(values))
              .map((f) => (
                <div key={f.name} className={`space-y-2 ${f.half ? "" : "sm:col-span-2"}`}>
                  {f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={!!values[f.name]}
                        onCheckedChange={(c) => setValues((v) => ({ ...v, [f.name]: !!c }))}
                      />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <Label htmlFor={`${table}-${f.name}`}>
                        {f.label}
                        {f.required && <span className="text-destructive"> *</span>}
                      </Label>
                      {f.type === "textarea" ? (
                        <Textarea
                          id={`${table}-${f.name}`}
                          rows={3}
                          value={String(values[f.name] ?? "")}
                          placeholder={f.placeholder ?? ""}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                        />
                      ) : f.type === "select" ? (
                        <select
                          id={`${table}-${f.name}`}
                          value={String(values[f.name] ?? "")}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Selecciona…</option>
                          {(f.options ?? []).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={`${table}-${f.name}`}
                          type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type ?? "text"}
                          value={String(values[f.name] ?? "")}
                          placeholder={f.placeholder ?? ""}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
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
            <AlertDialogTitle>¿Eliminar este registro?</AlertDialogTitle>
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
                  toast.success("Registro eliminado");
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
