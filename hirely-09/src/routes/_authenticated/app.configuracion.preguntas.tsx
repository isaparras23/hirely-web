import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/app/configuracion/preguntas")({
  head: () => ({
    meta: [
      { title: "Preguntas frecuentes — Hirely" },
      { name: "description", content: "Respuestas rápidas sobre el perfil, la hoja de vida y la extensión." },
      { property: "og:title", content: "Preguntas frecuentes — Hirely" },
      { property: "og:description", content: "Dudas comunes sobre Hirely." },
    ],
  }),
  component: Preguntas,
});

const faqs: { q: string; a: string }[] = [
  { q: "¿Cómo genero mi CV?", a: "Desde Mi hoja de vida, pulsa Generar CV y personaliza el resultado." },
  { q: "¿Puedo importar un CV existente?", a: "Sí, sube un PDF desde Mi perfil o Mi hoja de vida." },
  { q: "¿Qué hace la extensión?", a: "Detecta formularios de postulación y los autocompleta con tus datos." },
  { q: "¿Cómo elimino mi cuenta?", a: "En Configuración > Eliminar cuenta." },
];

function Preguntas() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[28px] font-semibold">Preguntas frecuentes</h1>
      <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5 shadow-soft">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button asChild variant="ghost" className="mt-6">
        <Link to="/app/configuracion">Volver a configuración</Link>
      </Button>
    </div>
  );
}
