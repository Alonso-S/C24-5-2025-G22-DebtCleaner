import { prisma } from "../../../common/infrastructure/prismaClient";
import type { User } from "../../../generated/prisma";
import { toUserId } from "../../../common/utils/typeConverters";
import type { Role } from "../types/user";

export class UserRepository {
  async findById(id: string | number): Promise<User | null> {
    const userIdNumber = toUserId(id);
    return prisma.user.findUnique({
      where: {
        id: userIdNumber,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async updateRole(id: string | number, role: Role): Promise<User> {
    const userIdNumber = toUserId(id);
    return prisma.user.update({
      where: {
        id: userIdNumber,
      },
      data: {
        role,
      },
    });
  }
}

export const userRepository = new UserRepository();
