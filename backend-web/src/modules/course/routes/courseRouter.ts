import { Router } from "express";
import { courseController } from "../controllers/courseController";
import {
  authenticate,
  authorize,
} from "../../../common/middleware/authMiddleware";
import { validateRequest } from "../validators/courseValidator";

const courseRouter = Router();

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

courseRouter.get(
  "/professor",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  courseController.getCoursesByProfessor
);
courseRouter.delete(
  "/:courseId/students/:studentId",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  courseController.removeStudent
);

courseRouter.get(
  "/:id/students",
  authenticate,
  courseController.getStudentsByCourse
);

// Rutas generales
courseRouter.get("/:id", authenticate, courseController.getCourseById);

// Rutas para profesores
courseRouter.post(
  "/",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  validateRequest("createCourse"),
  courseController.createCourse
);

courseRouter.put(
  "/:id",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  validateRequest("createCourse"),
  courseController.updateCourseById
);
courseRouter.delete(
  "/:id",
  authenticate,
  authorize(["PROFESSOR", "ADMIN"]),
  courseController.deleteCourseById
);

export default courseRouter;
