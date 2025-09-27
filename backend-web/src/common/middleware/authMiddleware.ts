import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../infrastructure/jwtService";
import { authService } from "../../modules/auth/services/authService";

/**
 * Middleware para verificar autenticación mediante JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Si no hay token en el header, intentamos usar el refresh token de las cookies
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        try {
          // Intentamos renovar el token usando el refresh token
          const tokens = await authService.refreshAccessToken(refreshToken);

          if (tokens) {
            // Si se pudo renovar, establecemos el usuario y continuamos
            const decoded = jwtService.verifyToken(tokens.accessToken);
            req.user = decoded;

            // Actualizamos la cookie con el nuevo refresh token
            res.cookie("refreshToken", tokens.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
              path: "/api/auth/refresh-token",
            });

            // Añadimos el nuevo token al header para que el cliente lo reciba
            res.setHeader("X-New-Access-Token", tokens.accessToken);

            return next();
          }
        } catch (refreshError) {
          // Si falla la renovación, registramos el error para depuración
          console.error(
            "Error al renovar token con refresh token:",
            refreshError
          );
        }
      }

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

    req.user = decoded;

    next();
  } catch (error) {
    // Si el token es inválido o expiró, intentamos usar el refresh token
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        // Intentamos renovar el token usando el refresh token
        const tokens = await authService.refreshAccessToken(refreshToken);

        if (tokens) {
          const decoded = jwtService.verifyToken(tokens.accessToken);
          req.user = decoded;

          // Actualizamos la cookie con el nuevo refresh token
          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            path: "/api/auth/refresh-token",
          });

          res.setHeader("X-New-Access-Token", tokens.accessToken);

          return next();
        }
      } catch (refreshError) {
        // Si falla la renovación, registramos el error para depuración
        console.error(
          "Error al renovar token con refresh token:",
          refreshError
        );
      }
    }

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
