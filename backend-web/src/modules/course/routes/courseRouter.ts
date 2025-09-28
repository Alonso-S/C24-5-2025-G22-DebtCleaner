import { Router } from "express";
import { courseController } from "../controllers/courseController";
import {
  authenticate,
  authorize,
} from "../../../common/middleware/authMiddleware";
import { validateRequest } from "../validators/courseValidator";

const courseRouter = Router();

// Rutas para profesores
courseRouter.post(
  "/",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  validateRequest("createCourse"),
  courseController.createCourse
);

courseRouter.get(
  "/professor",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  courseController.getCoursesByProfessor
);

courseRouter.post(
  "/enroll",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  validateRequest("enrollStudent"),
  courseController.enrollStudent
);

// Rutas para estudiantes
courseRouter.get(
  "/enrolled",
  authenticate,
  courseController.getEnrolledCourses
);

courseRouter.post(
  "/join",
  authenticate,
  validateRequest("joinCourse"),
  courseController.joinCourse
);

// Rutas generales
courseRouter.get("/:id", authenticate, courseController.getCourseById);

export default courseRouter;
