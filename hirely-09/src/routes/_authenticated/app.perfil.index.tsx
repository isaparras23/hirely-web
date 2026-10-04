import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Pencil, Upload } from "lucide-react";
import { PageHeader, Section, FieldRow } from "@/components/layout";
import { useProfile } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/errors";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/perfil/")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Hirely" },
      { name: "description", content: "Tus datos personales, de contacto y preferencias laborales en Hirely." },
      { property: "og:title", content: "Mi perfil — Hirely" },
      { property: "og:description", content: "Datos personales, contacto y preferencias." },
    ],
  }),
  component: Perfil,
});

const vacio = "Sin completar";

function Perfil() {
  const { data: profile, isLoading } = useProfile();
  const { user } = useAuth();

  const v = (key: string) => (profile?.[key] ? String(profile[key]) : vacio);
  const nombre = [profile?.["first_name"], profile?.["last_name"]].filter(Boolean).join(" ") || vacio;

  const recuperar = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    toast.success("Te enviamos un correo para cambiar tu contraseña.");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Mi perfil"
        description="Tus datos personales, de contacto y preferencias laborales."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/perfil/importar-cv">
                <Upload className="size-4" /> Importar CV
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app/perfil/editar">
                <Pencil className="size-4" /> Editar
              </Link>
            </Button>
          </>
        }
      />

      {isLoading ? (
        <p className="mt-9 text-sm text-muted-foreground">Cargando tu perfil…</p>
      ) : (
        <div className="mt-9 space-y-5">
          <Section title="Información personal">
            <div className="divide-y divide-border">
              <FieldRow label="Nombre" value={nombre} />
              <FieldRow label="Correo" value={user?.email ?? vacio} />
              <FieldRow label="Fecha de nacimiento" value={v("birth_date")} />
              <FieldRow
                label="Lugar de nacimiento"
                value={
                  [profile?.["birth_city"], profile?.["birth_country"]].filter(Boolean).join(", ") || vacio
                }
              />
              <FieldRow label="Nacionalidad" value={v("nationality")} />
              <FieldRow label="Documento" value={
                [profile?.["document_type"], profile?.["document_number"]].filter(Boolean).join(" ") || vacio
              } />
            </div>
          </Section>

          <Section title="Contacto">
            <div className="divide-y divide-border">
              <FieldRow label="Teléfono" value={v("phone")} />
              <FieldRow label="Teléfono alternativo" value={v("phone_secondary")} />
              <FieldRow label="Dirección" value={v("address")} />
              <FieldRow
                label="Ciudad actual"
                value={
                  [profile?.["current_city"], profile?.["current_country"]].filter(Boolean).join(", ") || vacio
                }
              />
              <FieldRow label="LinkedIn" value={v("linkedin_url")} />
              <FieldRow label="Sitio web" value={v("website_url")} />
              <FieldRow label="Portafolio" value={v("portfolio_url")} />
            </div>
          </Section>

          <Section title="Preferencias laborales">
            <div className="divide-y divide-border">
              <FieldRow label="Cargo deseado" value={v("desired_position")} />
              <FieldRow label="Área de interés" value={v("desired_area")} />
              <FieldRow label="Modalidad" value={v("work_modality")} />
              <FieldRow label="Tipo de contrato" value={v("contract_type")} />
              <FieldRow label="Jornada" value={v("work_schedule")} />
              <FieldRow label="Disponible desde" value={v("available_from")} />
              <FieldRow
                label="Disponibilidad para viajar"
                value={profile?.["willing_to_travel"] ? "Sí" : "No"}
              />
              <FieldRow
                label="Disponibilidad para reubicarse"
                value={profile?.["willing_to_relocate"] ? "Sí" : "No"}
              />
              <FieldRow
                label="Expectativa salarial"
                value={
                  profile?.["salary_expectation"]
                    ? `${profile["salary_expectation"]} ${profile["salary_currency"] ?? ""}`.trim()
                    : vacio
                }
              />
            </div>
          </Section>

          <Section title="Seguridad">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Cambia tu contraseña con un enlace seguro enviado a tu correo.
              </p>
              <Button variant="outline" size="sm" onClick={recuperar}>
                Enviar correo de recuperación
              </Button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
