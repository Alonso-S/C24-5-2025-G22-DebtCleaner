import { Router } from "express";
import { requestLoginCodeHandler, verifyLoginCodeHandler, googleCallbackHandler, refreshTokenHandler } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login/code", requestLoginCodeHandler);
authRouter.post("/login/verify", verifyLoginCodeHandler);
authRouter.get("/google/callback", googleCallbackHandler);
authRouter.post("/refresh-token", refreshTokenHandler);

export { authRouter };