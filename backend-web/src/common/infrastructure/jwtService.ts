import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../../config";
import type { AuthUser } from "../../modules/auth/types/auth";

/**
 * Servicio para manejo de tokens JWT
 */
export const jwtService = {
  /**
   * Genera un token JWT para un usuario
   */
  generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  /**
   * Genera un refresh token para un usuario
   */
  generateRefreshToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  },

  /**
   * Verifica un token JWT
   */
  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  },

  /**
   * Verifica un refresh token
   */
  verifyRefreshToken(token: string): any {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }
};