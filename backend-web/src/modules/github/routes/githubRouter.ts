import { Router } from "express";
import { githubController } from "../controllers/githubController";
import { authenticate } from "../../../common/middleware/authMiddleware";

const router = Router();

// Rutas públicas
router.get("/authorize", authenticate, githubController.authorize);
router.get("/callback", authenticate, githubController.callback);

// Rutas protegidas
router.get("/connection", authenticate, githubController.checkConnection);
router.post("/disconnect", authenticate, githubController.disconnect);

export const githubRouter = router;
