// Tipos para el módulo de autenticación

export type Email = string & { readonly __brand: unique symbol };

export type AuthUser = {
  id: number;
  name: string;
  email: Email;
  role: string;
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
