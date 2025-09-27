import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_FRONTEND_URL } from "../../config";

// Cliente OAuth2 de Google
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${APP_FRONTEND_URL}/auth/google/callback`
);

/**
 * Proveedor de autenticación con Google
 */
export const googleAuthProvider = {
  /**
   * Obtiene información del usuario a partir del código de autorización
   */
  async getUserFromCode(code: string): Promise<{ email: string; name: string }> {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.id_token) {
      throw new Error("No se pudo obtener el token de ID");
    }
    
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      throw new Error("No se pudo obtener información del usuario");
    }
    
    return {
      email: payload.email,
      name: payload.name || "",
    };
  }
};