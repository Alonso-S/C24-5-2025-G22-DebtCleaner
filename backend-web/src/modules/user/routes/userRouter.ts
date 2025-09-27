import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../../common/middleware/authMiddleware";
import { getUserProfileHandler } from "../controllers/userController";

const userRouter = Router();

// Ruta protegida que requiere autenticación
userRouter.get("/profile", authenticate, getUserProfileHandler);

// Ruta protegida que requiere autenticación y rol específico
userRouter.get("/admin", authenticate, authorize(["ADMIN"]), (req, res) => {
  res.json({ message: "Acceso a panel de administración" });
});

export { userRouter };
