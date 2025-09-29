import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authenticate } from "../../../common/middleware/authMiddleware";

const router = Router();

// Rutas para comentarios
router.post("/", authenticate, commentController.createComment);
router.get("/submission/:submissionId", authenticate, commentController.getCommentsBySubmission);
router.put("/:commentId", authenticate, commentController.updateComment);
router.delete("/:commentId", authenticate, commentController.deleteComment);

// Ruta para actualizar estado de revisión
router.put("/submission/:submissionId/review-status", authenticate, commentController.updateReviewStatus);

export default router;