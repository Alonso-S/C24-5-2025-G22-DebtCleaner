import type { AuthUserRepository } from "../domain/repositories/AuthUserRepository";
import type { AuthUser } from "../domain/types/AuthUser";
import type { Mailer } from "../../../common/contracts/Mailer";
import { generateAccessToken } from "../infrastructure/jwt";
import {
  deleteLoginCode,
  isLoginCodeCorrect,
  storeLoginCode,
} from "../infrastructure/redisStore";
import { sendLoginCodeEmail } from "../infrastructure/mailer";
import generateLoginCode from "../domain/generateLoginCode";
import type { Email } from "../../../common/types/Email";

export const createAuthService = (
  authRepo: AuthUserRepository,
  mailer: Mailer
) => {
  return {
    async getUserIfExists(email: Email): Promise<AuthUser | null> {
      return authRepo.findByEmail(email);
    },

    async createUser(name: string, email: Email): Promise<AuthUser> {
      return authRepo.create(name, email);
    },

    async sendLoginCodeToUser(user: AuthUser): Promise<void> {
      const code = generateLoginCode(6);
      await sendLoginCodeEmail(user, code, mailer);
      await storeLoginCode(user.email, code);
    },

    async authenticateUser(email: Email, code: string): Promise<string> {
      const user = await this.getUserIfExists(email);
      if (!user) throw new Error("Usuario no encontrado");

      const isValidCode = await isLoginCodeCorrect(email, code);
      if (!isValidCode) throw new Error("Código de verificación incorrecto");
      await deleteLoginCode(email);
      return generateAccessToken(user);
    },
  };
};
