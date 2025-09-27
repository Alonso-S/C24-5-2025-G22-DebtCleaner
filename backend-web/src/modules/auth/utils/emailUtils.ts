import type { Email } from "../types/auth";

/**
 * Convierte un string a un tipo Email validado
 */
export function asEmail(value: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error(`Formato de email inválido: ${value}`);
  }
  return value as Email;
}
