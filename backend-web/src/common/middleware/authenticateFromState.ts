import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../infrastructure/jwtService";

export const authenticateFromState = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query.state as string | undefined;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token (state) ausente" });
  }

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
};
