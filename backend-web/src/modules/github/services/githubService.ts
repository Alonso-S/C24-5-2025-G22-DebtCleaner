import axios from "axios";
import { githubRepository } from "../repositories/githubRepository";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
} from "../../../config";

export const githubService = () => ({
  /**
   * Genera la URL de autorización para GitHub OAuth
   */
  getAuthorizationUrl(): string {
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo`;
  },

  /**
   * Intercambia el código de autorización por un token de acceso
   */
  exchangeCodeForToken: async (code: string): Promise<string> => {
    try {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw new Error("Failed to exchange code for token");
    }
  },

  /**
   * Guarda el token de GitHub para un usuario
   */
  saveGitHubToken: async (userId: number, token: string): Promise<void> => {
    await githubRepository.saveGitHubToken(userId, token);
  },

  /**
   * Obtiene el token de GitHub de un usuario
   */
  getGitHubToken: async (userId: number): Promise<string | null> => {
    return githubRepository.getGitHubToken(userId);
  },

  /**
   * Valida un repositorio de GitHub y obtiene información
   */
  validateGitHubRepository: async (
    repoUrl: string,
    userId: number
  ): Promise<{ isValid: boolean; commitHash?: string }> => {
    try {
      // Extraer el propietario y nombre del repositorio de la URL
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = repoUrl.match(urlPattern);

      if (!match) {
        return { isValid: false };
      }

      const [, owner, repo] = match;

      // Obtener el token del usuario
      const token = await githubRepository.getGitHubToken(userId);

      if (!token) {
        return { isValid: false };
      }

      // Verificar que el repositorio existe y obtener el último commit
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        return {
          isValid: true,
          commitHash: response.data[0].sha,
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error validating GitHub repository:", error);
      return { isValid: false };
    }
  },
});
