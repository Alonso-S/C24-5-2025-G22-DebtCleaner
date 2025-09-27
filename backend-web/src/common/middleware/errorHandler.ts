import type { Request, Response, NextFunction } from "express";

/**
 * Middleware para manejar errores de forma centralizada
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  return res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
