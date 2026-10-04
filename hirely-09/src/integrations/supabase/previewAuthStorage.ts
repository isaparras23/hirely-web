// Usar localStorage para persistencia de sesión
export function brokeredPreviewStorage() {
  // En desarrollo local y en producción, simplemente usar localStorage
  return localStorage;
}

