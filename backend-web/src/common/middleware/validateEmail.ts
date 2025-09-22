import type { Request, Response, NextFunction } from "express";
import { isEmailFromDomain } from "../utils/isEmailFromDomain";
import { isValidEmail } from "../utils/isValidEmail";

export function validateEmailRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  if (!isValidEmail(email) || !isEmailFromDomain(email, "tecsup.edu.pe")) {
    return res
      .status(400)
      .json({ error: "Correo no válido o dominio no permitido" });
  }

  next();
}
