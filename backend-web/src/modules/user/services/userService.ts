import { userRepository } from "../repositories/userRepository";
import type { UserDTO, Role } from "../types/user";
import { mapUserToDTO } from "../types/user";

export class UserService {
  async getUserProfile(userId: string | number): Promise<UserDTO | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    return mapUserToDTO(user);
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await userRepository.findAll();
    return users.map(mapUserToDTO);
  }

  async updateUserRole(
    userId: string | number,
    role: Role
  ): Promise<UserDTO | null> {
    try {
      const updatedUser = await userRepository.updateRole(userId, role);
      return mapUserToDTO(updatedUser);
    } catch (error) {
      console.error(`Error al actualizar el rol del usuario ${userId}:`, error);
      return null;
    }
  }
}

export const userService = new UserService();
