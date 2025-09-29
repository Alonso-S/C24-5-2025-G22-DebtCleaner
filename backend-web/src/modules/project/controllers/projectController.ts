import type { Request, Response } from "express";
import { projectService } from "../services/projectService";
import type { CreateProjectDTO, UpdateProjectDTO } from "../types/project";

export const projectController = {
  // Controladores para Proyectos
  async createProject(req: Request, res: Response) {
    try {
      const { title, description, dueDate, courseId } = req.body;

      // Convertir courseId a número
      const courseIdNumber = Number(courseId);
      if (isNaN(courseIdNumber)) {
        return res
          .status(400)
          .json({ error: "El ID del curso debe ser un número válido" });
      }

      const projectData: CreateProjectDTO = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        courseId: courseIdNumber,
      };

      const project = await projectService.createProject(projectData);
      return res.status(201).json(project);
    } catch (error: unknown) {
      console.error("Error al crear proyecto:", error);
      return res.status(500).json({ error: "Error al crear el proyecto" });
    }
  },

  async getProjectById(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.id);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ error: "El ID del proyecto debe ser un número válido" });
      }

      const project = await projectService.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }

      return res.status(200).json(project);
    } catch (error: unknown) {
      console.error("Error al obtener proyecto:", error);
      return res.status(500).json({ error: "Error al obtener el proyecto" });
    }
  },

  async getProjectsByCourse(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        return res
          .status(400)
          .json({ error: "El ID del curso debe ser un número válido" });
      }

      const projects = await projectService.getProjectsByCourseId(courseId);
      return res.status(200).json(projects);
    } catch (error: unknown) {
      console.error("Error al obtener proyectos del curso:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener los proyectos del curso" });
    }
  },

  async updateProject(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.id);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ error: "El ID del proyecto debe ser un número válido" });
      }

      const { title, description, dueDate } = req.body;

      const projectData: UpdateProjectDTO = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      };

      const project = await projectService.updateProject(
        projectId,
        projectData
      );
      return res.status(200).json(project);
    } catch (error: unknown) {
      console.error("Error al actualizar proyecto:", error);
      return res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
  },

  async deleteProject(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.id);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ error: "El ID del proyecto debe ser un número válido" });
      }

      await projectService.deleteProject(projectId);
      return res.status(204).send();
    } catch (error: unknown) {
      console.error("Error al eliminar proyecto:", error);
      return res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
  },

  // Controladores para Entregas de Proyectos
  async getProjectSubmissions(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.projectId);
      if (isNaN(projectId)) {
        return res
          .status(400)
          .json({ error: "El ID del proyecto debe ser un número válido" });
      }

      const submissions = await projectService.getProjectSubmissionsByProjectId(
        projectId
      );
      return res.status(200).json(submissions);
    } catch (error: unknown) {
      console.error("Error al obtener entregas del proyecto:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener las entregas del proyecto" });
    }
  },

  async getStudentSubmission(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.projectId);
      const userId = Number(req.params.userId);

      if (isNaN(projectId) || isNaN(userId)) {
        return res
          .status(400)
          .json({ error: "Los IDs deben ser números válidos" });
      }

      const submission =
        await projectService.getProjectSubmissionByProjectAndUser(
          projectId,
          userId
        );
      if (!submission) {
        return res.status(404).json({ error: "Entrega no encontrada" });
      }

      return res.status(200).json(submission);
    } catch (error: unknown) {
      console.error("Error al obtener entrega del estudiante:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener la entrega del estudiante" });
    }
  },

  async gradeSubmission(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);
      const { grade, feedback } = req.body;

      if (isNaN(submissionId)) {
        return res
          .status(400)
          .json({ error: "El ID de la entrega debe ser un número válido" });
      }

      if (isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 20) {
        return res
          .status(400)
          .json({ error: "La calificación debe ser un número entre 0 y 20" });
      }

      const submission = await projectService.gradeSubmission(
        submissionId,
        Number(grade),
        feedback
      );
      return res.status(200).json(submission);
    } catch (error: unknown) {
      console.error("Error al calificar entrega:", error);
      return res.status(500).json({ error: "Error al calificar la entrega" });
    }
  },

  // Este controlador se completará cuando implementemos la lógica de subida de archivos
  async submitProject(req: Request, res: Response) {
    try {
      const projectId = Number(req.params.projectId);
      const userId = Number(req.params.userId || req.body.userId);
      const { content } = req.body;

      if (isNaN(projectId) || isNaN(userId)) {
        return res
          .status(400)
          .json({ error: "Los IDs deben ser números válidos" });
      }

      // Por ahora, solo manejamos el contenido de texto
      // La implementación de archivos y Git se añadirá después
      const submission = await projectService.submitProject({
        projectId,
        userId,
        content: content || null,
      });
      return res.status(201).json(submission);
    } catch (error: unknown) {
      console.error("Error al enviar proyecto:", error);
      return res.status(500).json({ error: "Error al enviar el proyecto" });
    }
  },

  // Controladores para Versiones de Entregas
  async getSubmissionVersions(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);
      if (isNaN(submissionId)) {
        return res
          .status(400)
          .json({ error: "El ID de la entrega debe ser un número válido" });
      }

      const versions = await projectService.getProjectSubmissionVersions(
        submissionId
      );
      return res.status(200).json(versions);
    } catch (error: unknown) {
      console.error("Error al obtener versiones de la entrega:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener las versiones de la entrega" });
    }
  },
};
