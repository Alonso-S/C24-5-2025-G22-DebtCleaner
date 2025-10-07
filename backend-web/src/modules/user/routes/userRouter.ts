import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../../common/middleware/authMiddleware";
import {
  getUserProfileHandler,
  getAllUsersHandler,
  updateUserRoleHandler,
} from "../controllers/userController";

const userRouter = Router();

// Ruta protegida que requiere autenticación
userRouter.get("/profile", authenticate, getUserProfileHandler);

// Rutas para la gestión de usuarios (solo ADMIN)
userRouter.get("/", authenticate, authorize(["ADMIN"]), getAllUsersHandler);
userRouter.patch("/:id/role", authenticate, authorize(["ADMIN"]), updateUserRoleHandler);

// Ruta protegida que requiere autenticación y rol específico
userRouter.get("/admin", authenticate, authorize(["ADMIN"]), (req, res) => {
  res.json({ message: "Acceso a panel de administración" });
});

export { userRouter };
