import type { Email } from "../../modules/auth/types/auth";

/**
 * Convierte un valor a un ID numérico válido para Prisma
 */
export const toUserId = (id: string | number): number => {
  return typeof id === "string" ? parseInt(id, 10) : id;
};

/**
 * Convierte un valor a un tipo Email válido
 */
export const toEmail = (email: string | Email): Email => {
  return email as Email;
};
