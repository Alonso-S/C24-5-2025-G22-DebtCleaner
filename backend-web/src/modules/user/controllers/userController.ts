import type { Request, Response } from "express";
import { prisma } from "../../../common/infrastructure/prismaClient";
import { toUserId } from "../../../common/utils/typeConverters";

export const getUserProfileHandler = async (req: Request, res: Response) => {
  try {
    // El middleware de autenticación ya ha verificado el token y añadido el usuario al request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    // Convertimos el userId a número si es necesario
    const userIdNumber = toUserId(userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userIdNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
