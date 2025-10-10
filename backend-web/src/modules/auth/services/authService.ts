import { authRepository } from "../repositories/authRepository";
import type { AuthUser, Email } from "../types/auth";
import { generateLoginCode } from "../utils/codeGenerator";
import { mailerService } from "../../../common/infrastructure/mailerService";
import { jwtService } from "../../../common/infrastructure/jwtService";
import { redisService } from "../../../common/infrastructure/redisService";
import { googleAuthProvider } from "../../../common/infrastructure/googleAuthProvider";

const CODE_EXPIRATION_SECONDS = 300; // 5 minutos
const REFRESH_TOKEN_EXPIRATION_SECONDS = 604800; // 7 días

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Obtiene un usuario si existe
   */
  async getUserIfExists(email: Email): Promise<AuthUser | null> {
    return authRepository.findUserByEmail(email);
  },

  /**
   * Crea un nuevo usuario
   */
  async createUser(name: string, email: Email): Promise<AuthUser> {
    return authRepository.createUser(name, email);
  },

  /**
   * Envía un código de login al usuario
   */
  async sendLoginCodeToUser(user: AuthUser): Promise<void> {
    const code = generateLoginCode();

    // Guardar código en Redis
    await redisService.set(
      `login:${user.email}`,
      code,
      CODE_EXPIRATION_SECONDS
    );
    console.log(code);

    // Enviar email
    await mailerService.sendLoginCode(user.email, user.name, code);
  },

  /**
   * Autentica un usuario con email y código
   */
  async authenticateUser(
    email: Email,
    code: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const storedCode = await redisService.get(`login:${email}`);

    if (!storedCode || storedCode !== code) {
      throw new Error("Código inválido o expirado");
    }

    const user = await this.getUserIfExists(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Eliminar código usado
    await redisService.del(`login:${email}`);

    // Generar tokens JWT
    const accessToken = jwtService.generateToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  },

  /**
   * Autentica con código de autorización de Google
   */
  async authenticateWithGoogleAuthorizationCode(
    code: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const googleUser = await googleAuthProvider.getUserFromCode(code);

    if (!googleUser || !googleUser.email) {
      throw new Error("No se pudo obtener información del usuario de Google");
    }

    const email = googleUser.email as Email;
    let user = await this.getUserIfExists(email);

    if (!user) {
      user = await this.createUser(
        googleUser.name || "Usuario de Google",
        email
      );
    }

    const accessToken = jwtService.generateToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  },

  /**
   * Refresca un token de acceso usando un refresh token
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verificar el refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken);

      // Obtener el usuario por ID
      const user = await authRepository.findUserById(decoded.id);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Generar nuevos tokens
      const newAccessToken = jwtService.generateToken(user);
      const newRefreshToken = jwtService.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Refresh token inválido o expirado");
    }
  },
};
