import type { AuthUser } from "../types/AuthUser.js";
import type { Email } from "../../../../common/types/Email.js";

export interface AuthUserRepository {
  findByEmail(email: Email): Promise<AuthUser | null>;
  create(name: string, email: Email, role?: string): Promise<AuthUser>;
}
