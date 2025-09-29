import { prisma } from '../../../common/infrastructure/prismaClient';

export const githubRepository = {
  /**
   * Guarda el token de GitHub para un usuario
   */
  async saveGitHubToken(userId: number, token: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { githubToken: token },
    });
  },

  /**
   * Obtiene el token de GitHub de un usuario
   */
  async getGitHubToken(userId: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true },
    });

    return user?.githubToken || null;
  },
};