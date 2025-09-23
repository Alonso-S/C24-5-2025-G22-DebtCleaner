import type { Request, Response } from "express";
import { createAuthService } from "../application/AuthService";
import { PrismaAuthUserRepository } from "../infrastructure/PrismaAuthUserRepository";
import { NodeMailer } from "../../../common/infrastructure/NodeMailer";
import { asEmail } from "../../../common/utils/asEmail";

const authService = createAuthService(PrismaAuthUserRepository, NodeMailer);

type LoginBody = { email: string; name?: string };

export const requestLoginCodeHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name } = req.body as LoginBody;

    const typedEmail = asEmail(email);
    let user = await authService.getUserIfExists(typedEmail);

    if (!user) {
      if (!name)
        return res.status(409).send({
          message:
            "Usuario inexistente, se requiere el nombre para crear uno nuevo",
          userExists: false,
        });

      user = await authService.createUser(name, typedEmail);
    }
    console.time("sendLoginCode");

    await authService.sendLoginCodeToUser(user);
    console.timeEnd("sendLoginCode");

    return res
      .status(200)
      .send({ message: "Código enviado al correo", userExists: true });
  } catch (error) {
    return res.status(400).send({ error: (error as Error).message });
  }
};

export const verifyLoginCodeHandler = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body as { email: string; code: string };
    const typedEmail = asEmail(email);

    const token = await authService.authenticateUser(
      typedEmail,
      code.toString()
    );

    return res.status(200).send({ token });
  } catch (error) {
    return res
      .status(401)
      .send({ error: (error as Error).message ?? "Código inválido" });
  }
};
