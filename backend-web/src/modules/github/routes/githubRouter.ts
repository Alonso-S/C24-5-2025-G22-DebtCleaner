import { Router } from "express";
import { githubController } from "../controllers/githubController";
import { authenticate } from "../../../common/middleware/authMiddleware";
import { authenticateFromState } from "../../../common/middleware/authenticateFromState";

const router = Router();

// Rutas públicas
router.get("/authorize", authenticateFromState, githubController.authorize);
router.get("/callback", authenticateFromState, githubController.callback);

// Rutas protegidas
router.get("/connection", authenticate, githubController.checkConnection);
router.post("/disconnect", authenticate, githubController.disconnect);
// Obtener commits de un repositorio (requiere token del usuario)
router.get("/commits", authenticate, githubController.getCommits);

export const githubRouter = router;
