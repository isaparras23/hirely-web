/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Field } from "@/components/crud-section";
import type { Row } from "@/lib/data";

export type DraftItem = {
  key: string;
  included: boolean;
  values: Row;
};

let draftCounter = 0;
function nextKey() {
  draftCounter += 1;
  return `draft-${Date.now()}-${draftCounter}`;
}

/** Convierte los objetos que devolvió la IA en borradores editables por el usuario. */
export function draftsFromExtracted(items: Row[] | undefined | null): DraftItem[] {
  return (items ?? []).map((values) => ({
    key: nextKey(),
    included: true,
    values: { ...values },
  }));
}

/**
 * Lista de tarjetas editables para revisar datos detectados por la IA antes de guardarlos.
 * Cada tarjeta permite incluir/excluir el elemento, editar sus campos o quitarlo por completo.
 */
export function CvReviewList({
  items,
  onChange,
  fields,
  singular,
  renderTitle,
}: {
  items: DraftItem[];
  onChange: (items: DraftItem[]) => void;
  fields: Field[];
  singular: string;
  renderTitle: (values: Row) => string;
}) {
  const setValue = (key: string, name: string, value: unknown) => {
    onChange(items.map((it) => (it.key === key ? { ...it, values: { ...it.values, [name]: value } } : it)));
  };
  const setIncluded = (key: string, included: boolean) => {
    onChange(items.map((it) => (it.key === key ? { ...it, included } : it)));
  };
  const removeItem = (key: string) => {
    onChange(items.filter((it) => it.key !== key));
  };

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-primary-softer/60 p-5 text-sm text-muted-foreground">
        No detectamos {singular.toLowerCase()} en tu CV. Puedes agregarlos manualmente después de guardar.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.key}
          className={`rounded-xl border border-border p-4 transition-opacity ${item.included ? "" : "opacity-50"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={item.included} onCheckedChange={(checked) => setIncluded(item.key, !!checked)} />
              {renderTitle(item.values) || singular}
            </label>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Quitar ${singular}`}
              onClick={() => removeItem(item.key)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields
              .filter((f) => !f.hideIf?.(item.values))
              .map((f) => {
                const val = item.values[f.name];
                return (
                  <div key={f.name} className={`space-y-2 ${f.half ? "" : "sm:col-span-2"}`}>
                    {f.type === "checkbox" ? (
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={!!val}
                          onCheckedChange={(checked) => setValue(item.key, f.name, !!checked)}
                        />
                        {f.label}
                      </label>
                    ) : (
                      <>
                        <Label>
                          {f.label}
                          {f.required && <span className="text-destructive"> *</span>}
                        </Label>
                        {f.type === "textarea" ? (
                          <Textarea
                            rows={3}
                            value={String(val ?? "")}
                            placeholder={f.placeholder ?? ""}
                            onChange={(e) => setValue(item.key, f.name, e.target.value)}
                          />
                        ) : f.type === "select" ? (
                          <select
                            value={String(val ?? "")}
                            onChange={(e) => setValue(item.key, f.name, e.target.value)}
                            className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
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
                            type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type ?? "text"}
                            value={String(val ?? "")}
                            placeholder={f.placeholder ?? ""}
                            onChange={(e) => setValue(item.key, f.name, e.target.value)}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
