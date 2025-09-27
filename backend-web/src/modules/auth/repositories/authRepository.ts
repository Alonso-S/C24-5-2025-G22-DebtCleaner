import { prisma } from "../../../common/infrastructure/prismaClient";
import type { AuthUser, Email } from "../types/auth";
import { toUserId, toEmail } from "../../../common/utils/typeConverters";

/**
 * Funciones para acceder a datos de usuarios para autenticación
 */
export const authRepository = {
  /**
   * Busca un usuario por su email
   */

  async findUserByEmail(email: Email): Promise<AuthUser | null> {
    console.log(email);

    const user = await prisma.user.findUnique({
      where: { email: toEmail(email) as string },
    });
    return user
      ? {
          id: user.id,
          name: user.name,
          email: toEmail(email),
          role: user.role,
        }
      : null;
  },

  /**
   * Busca un usuario por su id
   */
  async findUserById(id: string | number): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: toUserId(id) },
    });

    return user
      ? {
          id: user.id,
          name: user.name,
          email: toEmail(user.email),
          role: user.role,
        }
      : null;
  },

  /**
   * Crea un nuevo usuario
   */
  async createUser(name: string, email: Email): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: {
        name,
        email: email as string,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: email,
      role: user.role,
    };
  },
};
