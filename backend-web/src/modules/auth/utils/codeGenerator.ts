/**
 * Genera un código numérico de 6 dígitos para login
 */
export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}