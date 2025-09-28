import type { Request, Response } from "express";
import { courseService } from "../services/courseService";
import type {
  CreateCourseDTO,
  EnrollStudentDTO,
  JoinCourseDTO,
} from "../types/course";

/**
 * Controlador para la gestión de cursos
 */
export const courseController = {
  /**
   * Crea un nuevo curso
   * @route POST /api/courses
   */
  async createCourse(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const courseData: CreateCourseDTO = {
        name,
        description,
        creatorId: Number(creatorId),
      };

      const course = await courseService.createCourse(courseData);
      return res.status(201).json(course);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear el curso";
      return res.status(500).json({ message: errorMessage });
    }
  },

  /**
   * Obtiene un curso por su ID
   * @route GET /api/courses/:id
   */
  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !/^\d+$/.test(id)) {
        return res.status(400).json({ message: "ID de curso inválido" });
      }

      const courseId = parseInt(id, 10);

      const course = await courseService.getCourseById(courseId);
      return res.status(200).json(course);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Curso no encontrado";
      return res.status(404).json({ message: errorMessage });
    }
  },

  /**
   * Obtiene todos los cursos creados por un profesor
   * @route GET /api/courses/professor
   */
  async getCoursesByProfessor(req: Request, res: Response) {
    try {
      const professorId = req.user?.id;

      if (!professorId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const courses = await courseService.getCoursesByProfessor(
        Number(professorId)
      );
      return res.status(200).json(courses);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al obtener los cursos";
      return res.status(500).json({ message: errorMessage });
    }
  },

  /**
   * Obtiene todos los cursos en los que está matriculado un estudiante
   * @route GET /api/courses/enrolled
   */
  async getEnrolledCourses(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;

      if (!studentId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const courses = await courseService.getEnrolledCoursesByStudent(
        Number(studentId)
      );
      return res.status(200).json(courses);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al obtener los cursos matriculados";
      return res.status(500).json({ message: errorMessage });
    }
  },

  /**
   * Matricula a un estudiante en un curso (por el profesor)
   * @route POST /api/courses/enroll
   */
  async enrollStudent(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.body;
      const professorId = req.user?.id;

      if (!professorId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Verificar que el curso pertenezca al profesor
      const course = await courseService.getCourseById(Number(courseId));
      if (course.creatorId !== Number(professorId)) {
        return res.status(403).json({
          message:
            "No tienes permiso para matricular estudiantes en este curso",
        });
      }

      const enrollmentData: EnrollStudentDTO = {
        userId: Number(userId),
        courseId: Number(courseId),
      };

      const enrollment = await courseService.enrollStudent(enrollmentData);
      return res.status(201).json(enrollment);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al matricular al estudiante";
      return res.status(500).json({ message: errorMessage });
    }
  },

  /**
   * Permite a un estudiante unirse a un curso mediante un código de acceso
   * @route POST /api/courses/join
   */
  async joinCourse(req: Request, res: Response) {
    try {
      const { accessCode } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const joinData: JoinCourseDTO = {
        userId: Number(userId),
        accessCode,
      };

      const enrollment = await courseService.joinCourseWithAccessCode(joinData);
      return res.status(201).json(enrollment);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al unirse al curso";
      return res.status(400).json({ message: errorMessage });
    }
  },

  /**
   * Obtiene todos los cursos disponibles en la plataforma
   * @route GET /api/courses
   */
};
