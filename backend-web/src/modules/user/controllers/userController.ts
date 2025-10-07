import type { Request, Response } from "express";
import { userService } from "../services/userService";
import type { Role } from "../types/user";

export const getUserProfileHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const user = await userService.getUserProfile(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener perfil de usuario",
    });
  }
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener todos los usuarios",
    });
  }
};

export const updateUserRoleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario y rol son requeridos",
      });
    }

    // Validar que el rol sea uno de los valores permitidos
    if (!["STUDENT", "PROFESSOR", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rol no válido. Debe ser STUDENT, PROFESSOR o ADMIN",
      });
    }

    const updatedUser = await userService.updateUserRole(id, role as Role);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o error al actualizar",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(
      `Error al actualizar el rol del usuario ${req.params.id}:`,
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el rol del usuario",
    });
  }
};
