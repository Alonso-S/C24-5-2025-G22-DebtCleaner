// Tipos para el módulo de autenticación

import type { Role } from "../../user/types/user";

export type Email = string & { readonly __brand: unique symbol };

export type AuthUser = {
  id: number;
  name: string;
  email: Email;
  role: Role;
};

export type LoginRequestDto = {
  email: string;
  name?: string;
};

export type LoginResponseDto = {
  message: string;
  userExists: boolean;
};

export type VerifyCodeRequestDto = {
  email: string;
  code: string;
};

export type VerifyCodeResponseDto = {
  token: string;
};

export type ErrorResponseDto = {
  error: string;
};
