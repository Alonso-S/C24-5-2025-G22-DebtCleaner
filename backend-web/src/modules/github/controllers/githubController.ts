import type { Request, Response } from "express";
import { githubService } from "../services/githubService";
import { AppError } from "../../../common/errors/AppError";

export const githubController = {
  /**
   * Redirige al usuario a la página de autorización de GitHub
   */
  async authorize(req: Request, res: Response) {
    const authUrl = githubService().getAuthorizationUrl();
    res.redirect(authUrl);
  },

  /**
   * Maneja el callback de GitHub después de la autorización
   */
  async callback(req: Request, res: Response) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        throw new AppError("No authorization code provided", 400);
      }

      // Obtener el token de acceso
      const accessToken = await githubService().exchangeCodeForToken(code);

      // Guardar el token para el usuario actual
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      await githubService().saveGitHubToken(Number(userId), accessToken);

      // Redirigir al frontend con un mensaje de éxito
      res.redirect("/profile?github=connected");
    } catch (error) {
      console.error("GitHub callback error:", error);
      res.redirect("/profile?error=github_connection_failed");
    }
  },

  /**
   * Verifica si el usuario tiene un token de GitHub válido
   */
  async checkConnection(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const token = await githubService().getGitHubToken(Number(userId));

      res.json({
        connected: !!token,
      });
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
      throw new AppError("Failed to check GitHub connection", 500);
    }
  },

  /**
   * Desconecta la cuenta de GitHub del usuario
   */
  async disconnect(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      await githubService().saveGitHubToken(
        Number(userId),
        null as unknown as string
      );

      res.json({
        success: true,
        message: "GitHub account disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting GitHub account:", error);
      throw new AppError("Failed to disconnect GitHub account", 500);
    }
  },
};
