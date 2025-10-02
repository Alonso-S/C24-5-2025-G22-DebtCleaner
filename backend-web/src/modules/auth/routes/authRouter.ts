import { Router } from "express";
import {
  requestLoginCodeHandler,
  verifyLoginCodeHandler,
  googleCallbackHandler,
  refreshTokenHandler,
  logoutHandler,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login/code", requestLoginCodeHandler);
authRouter.post("/login/verify", verifyLoginCodeHandler);
authRouter.get("/google/callback", googleCallbackHandler);
authRouter.post("/refresh-token", refreshTokenHandler);
authRouter.post("/logout", logoutHandler);

export { authRouter };
