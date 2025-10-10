import type { Request, Response } from "express";
import { githubService } from "../services/githubService";
import { AppError } from "../../../common/errors/AppError";
import { APP_FRONTEND_URL } from "../../../config";

export const githubController = {
  /**
   * Redirige al usuario a la página de autorización de GitHub
   */
  async authorize(req: Request, res: Response) {
    const state = req.query.state;
    if (!state || typeof state !== "string") {
      return res.status(400).json({ error: "State parameter is required" });
    }
    console.log("Generating GitHub authorization URL");

    const authUrl = githubService().getAuthorizationUrl(state);
    res.redirect(authUrl);
  },

  /**
   * Maneja el callback de GitHub después de la autorización
   */
  async callback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      console.log("GitHub callback received with code:", code);

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
      res.redirect(`${APP_FRONTEND_URL}?github=connected`);
    } catch (error) {
      console.error("GitHub callback error:", error);
      res.redirect(`${APP_FRONTEND_URL}?error=github_connection_failed`);
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
  async getCommits(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const repo = req.query.repo;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }
      if (!repo || typeof repo !== "string") {
        return res
          .status(400)
          .json({
            success: false,
            message: "Query param repo is required (owner/repo)",
          });
      }

      const commits = await githubService().listRepositoryCommits(
        repo,
        Number(userId)
      );

      res.json({ success: true, data: commits });
    } catch (error) {
      console.error("Error fetching commits:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch commits" });
    }
  },
};
