import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../infrastructure/jwtService";

/**
 * Middleware para verificar autenticación mediante JWT
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token válido",
      });
    }
    const decoded = jwtService.verifyToken(token);

    // Añadir información del usuario al objeto request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

/**
 * Middleware para verificar roles de usuario
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No autorizado para acceder a este recurso",
      });
    }

    next();
  };
};
