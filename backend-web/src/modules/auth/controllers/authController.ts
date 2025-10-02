import type { Request, Response } from "express";
import { authService } from "../services/authService";
import { asEmail } from "../utils/emailUtils";
import { APP_FRONTEND_URL, NODE_ENV } from "../../../config";
import type { LoginRequestDto, VerifyCodeRequestDto } from "../types/auth";

export const requestLoginCodeHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name } = req.body as LoginRequestDto;

    const typedEmail = asEmail(email);
    let user = await authService.getUserIfExists(typedEmail);

    if (!user) {
      if (!name) {
        return res.status(409).json({
          message:
            "Usuario inexistente, se requiere el nombre para crear uno nuevo",
          userExists: false,
        });
      }

      user = await authService.createUser(name, typedEmail);
    }

    await authService.sendLoginCodeToUser(user);

    return res.status(200).json({
      message: "Código enviado al correo",
      userExists: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const verifyLoginCodeHandler = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body as VerifyCodeRequestDto;
    const typedEmail = asEmail(email);

    const result = await authService.authenticateUser(
      typedEmail,
      code.toString()
    );

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Código inválido o expirado",
      });
    }

    // Enviar refresh token como cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: "/api/auth/refresh-token", // Solo accesible para la ruta de refresh
    });

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      // Ya no enviamos el refreshToken en el cuerpo de la respuesta
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const googleCallbackHandler = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Código no proporcionado" });
    }

    const token = await authService.authenticateWithGoogleAuthorizationCode(
      code
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: NODE_ENV == "production" ? "none" : "lax",
      secure: NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
    return res.redirect(`${APP_FRONTEND_URL}`);
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    // Obtener el refresh token de las cookies en lugar del body
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token no proporcionado",
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Refresh token inválido o expirado",
      });
    }

    // Actualizar la cookie con el nuevo refresh token
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: "/api/auth/refresh-token",
    });

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      // Ya no enviamos el refreshToken en el cuerpo de la respuesta
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const logoutHandler = async (_req: Request, res: Response) => {
  try {
    // Eliminar la cookie de refreshToken
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: "/api/auth/refresh-token",
    });

    return res.status(200).json({
      success: true,
      message: "Logout exitoso",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
