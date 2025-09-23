import { Router } from "express";
import {
  requestLoginCodeHandler,
  verifyLoginCodeHandler,
} from "./authController";
import { validateEmailRequest } from "../../../common/middleware/validateEmail";

const router = Router();

router.post(
  "/request-login-code",
  validateEmailRequest,
  requestLoginCodeHandler
);
router.post("/verify-login-code", validateEmailRequest, verifyLoginCodeHandler);

export default router;
