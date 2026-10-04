import { createFileRoute, redirect } from "@tanstack/react-router";

// La edición ahora ocurre directamente en cada sección de /app/hoja-de-vida.
export const Route = createFileRoute("/_authenticated/app/hoja-de-vida/editar")({
  beforeLoad: () => {
    throw redirect({ to: "/app/hoja-de-vida" });
  },
  component: () => null,
});
