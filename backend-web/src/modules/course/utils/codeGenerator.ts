import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Genera un código de acceso único para los cursos
 * @returns Código de acceso único de 6 caracteres
 */
export async function generateUniqueAccessCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let isUnique = false;
  let accessCode = '';

  while (!isUnique) {
    accessCode = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      accessCode += characters.charAt(randomIndex);
    }

    // Verificar que el código no exista ya en la base de datos
    const existingCourse = await prisma.course.findUnique({
      where: { accessCode }
    });

    if (!existingCourse) {
      isUnique = true;
    }
  }

  return accessCode;
}