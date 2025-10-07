import type { User } from "../../../generated/prisma";

export type Role = 'STUDENT' | 'PROFESSOR' | 'ADMIN';

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export function mapUserToDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
