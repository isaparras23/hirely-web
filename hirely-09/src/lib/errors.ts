/** Convierte errores técnicos en mensajes claros para la persona usuaria. */
export function friendlyError(error: unknown, fallback = "No pudimos completar la acción. Inténtalo de nuevo."): string {
  if (!error) return fallback;
  const err = error as { code?: string; message?: string; status?: number };
  const code = err.code ?? "";
  const message = (err.message ?? "").toLowerCase();

  if (code === "23505" || message.includes("duplicate key")) {
    return "Esta información ya existe en tu perfil.";
  }
  if (code === "23503") return "No encontramos el registro relacionado.";
  if (message.includes("end_date_before_start_date")) {
    return "La fecha de finalización no puede ser anterior a la de inicio.";
  }
  if (message.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (message.includes("email not confirmed")) {
    return "Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.";
  }
  if (message.includes("user already registered") || message.includes("already been registered")) {
    return "Ya existe una cuenta con este correo. Inicia sesión.";
  }
  if (message.includes("password should be at least")) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (code === "weak_password" || message.includes("known to be weak") || message.includes("pwned")) {
    return "Esa contraseña es demasiado común y fue filtrada en otros sitios. Elige una diferente (combina mayúsculas, números y símbolos).";
  }
  if (code === "validation_failed" || message.includes("invalid email") || message.includes("unable to validate email")) {
    return "El correo no es válido. Revísalo e inténtalo de nuevo.";
  }
  if (code === "signup_disabled" || message.includes("signups not allowed")) {
    return "El registro con correo está deshabilitado por ahora. Usa Continuar con Google.";
  }
  if (message.includes("error sending confirmation") || message.includes("error sending email")) {
    return "No pudimos enviar el correo de confirmación. Inténtalo de nuevo en unos minutos.";
  }
  if (err.status === 500 || err.status === 503 || message.includes("unexpected_failure")) {
    return "Error temporal del servicio. Inténtalo de nuevo en unos minutos.";
  }
  if (message.includes("rate limit") || err.status === 429) {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }
  if (message.includes("row-level security") || err.status === 401 || err.status === 403) {
    return "No tienes permiso para realizar esta acción.";
  }
  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Problema de conexión. Revisa tu internet e inténtalo de nuevo.";
  }
  console.error(error);
  return fallback;
}

export const MIN_PASSWORD_LENGTH = 8;
