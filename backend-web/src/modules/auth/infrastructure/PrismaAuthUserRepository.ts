import type { AuthUserRepository } from "../domain/repositories/AuthUserRepository";
import type { AuthUser } from "../domain/types/AuthUser";
import type { Email } from "../../../common/types/Email";
import { prisma } from "../../../config/prisma";

export const PrismaAuthUserRepository: AuthUserRepository = {
  async findByEmail(email: Email): Promise<AuthUser | null> {
    const user: AuthUser | null = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return user;
  },

  async create(
    name: string,
    email: Email,
    role: string = "student"
  ): Promise<AuthUser> {
    const user: AuthUser = await prisma.user.create({
      data: { name, email, role },
    });
    return user;
  },
};
