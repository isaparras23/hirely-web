import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useProfile, useSaveRow } from "@/lib/data";
import { extractCvData } from "@/lib/cv-import.functions";

export const Route = createFileRoute("/_authenticated/app/perfil/importar-cv/")({
  head: () => ({
    meta: [
      { title: "Importar CV — Hirely" },
      { name: "description", content: "Sube un PDF para actualizar tu perfil de Hirely." },
      { property: "og:title", content: "Importar CV — Hirely" },
      { property: "og:description", content: "Sube un PDF para actualizar tu perfil." },
    ],
  }),
  component: ImportarCv,
});

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

function ImportarCv() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const saveResume = useSaveRow("resumes");
  const saveCvImport = useSaveRow("cv_imports");
  const runExtraction = useServerFn(extractCvData);

  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      toast.error("Solo se aceptan archivos PDF.");
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      toast.error("El archivo no puede pesar más de 5MB.");
      return;
    }
    setFile(selected);
  };

  const continuar = async () => {
    if (!file || !user || !profile) return;
    setProcessing(true);
    try {
      const path = `${user.id}/${Date.now()}-${sanitizeFileName(file.name)}`;

      const { error: uploadError } = await supabase.storage.from("cvs").upload(path, file, {
        contentType: "application/pdf",
      });
      if (uploadError) throw uploadError;

      const resume = await saveResume.mutateAsync({
        values: {
          file_name: file.name,
          file_path: path,
          file_size: file.size,
          file_type: file.type,
          source: "ai_import",
          status: "processing",
        },
      });

      const cvImport = await saveCvImport.mutateAsync({
        values: {
          resume_id: resume["id"],
          status: "processing",
          started_at: new Date().toISOString(),
        },
      });

      await runExtraction({
        data: { resumeId: resume["id"] as string, cvImportId: cvImport["id"] as string },
      });

      toast.success("Analizamos tu CV. Revisa los datos antes de guardarlos.");
      navigate({
        to: "/app/perfil/importar-cv/revisar/$cvImportId",
        params: { cvImportId: cvImport["id"] as string },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos procesar tu CV. Inténtalo de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-[28px] font-semibold">Importar CV</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sube tu hoja de vida en PDF (máx. 5MB). Antes de guardar nada, vas a poder revisar y
        editar la información que detectemos.
      </p>
      <label className="mt-8 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-primary-softer p-12 text-sm text-muted-foreground transition-colors hover:border-primary/50">
        <UploadCloud className="size-8 text-primary" />
        {file ? file.name : "Arrastra tu PDF o haz clic para seleccionarlo"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild variant="ghost" disabled={processing}>
          <Link to="/app/perfil">Cancelar</Link>
        </Button>
        <Button onClick={continuar} disabled={!file || processing}>
          {processing && <Loader2 className="size-4 animate-spin" />}
          {processing ? "Analizando tu CV…" : "Continuar"}
        </Button>
      </div>
      {processing && (
        <p className="mt-3 text-xs text-muted-foreground">
          Puede tardar hasta un minuto si el servicio de IA está muy ocupado.
        </p>
      )}
    </div>
  );
}
