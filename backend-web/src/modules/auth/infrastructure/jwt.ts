import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from "../../../config";
import type { AuthUser } from "../domain/types/AuthUser";
import type { Email } from "../../../common/types/Email";

export interface JwtPayload {
  userId: number;
  email: Email;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (user: AuthUser): string => {
  const { id: userId, email, role } = user;
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (user: AuthUser): string => {
  const { id: userId, email, role } = user;

  return jwt.sign({ userId, email, role }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
