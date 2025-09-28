import type { Request, Response } from "express";
import path from "path";
import { projectService } from "../services/projectService";
import type { UploadSubmissionFileDTO, ConnectGitRepositoryDTO } from "../types/project";

/**
 * Controlador para la gestión de entregas de proyectos
 */
export const submissionController = {
  // Subir un archivo ZIP como entrega
  async uploadSubmissionFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se ha proporcionado ningún archivo",
        });
      }

      const { projectId, userId, content } = req.body;

      // Obtener la ruta relativa del archivo
      const fileUrl = path
        .relative(process.cwd(), req.file.path)
        .replace(/\\/g, "/");

      // Crear la entrega con la URL del archivo
      const data: UploadSubmissionFileDTO = {
        projectId: Number(projectId),
        userId: Number(userId),
        content: content || null,
        fileUrl,
      };

      const submission = await projectService.uploadSubmissionFile(data);

      return res.status(201).json({
        success: true,
        message: "Archivo subido correctamente",
        data: submission,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al subir el archivo",
        error: error.message,
      });
    }
  },

  // Conectar un repositorio Git
  async connectGitRepository(req: Request, res: Response) {
    try {
      const { projectId, userId, gitRepositoryUrl, content } = req.body;

      // Crear la entrega con la URL del repositorio Git
      const data: ConnectGitRepositoryDTO = {
        projectId: Number(projectId),
        userId: Number(userId),
        content: content || null,
        gitRepositoryUrl,
      };

      const submission = await projectService.connectGitRepository(data);

      return res.status(201).json({
        success: true,
        message: "Repositorio Git conectado correctamente",
        data: submission,
      });
    } catch (error: any) {
      // Determinar el código de estado basado en el tipo de error
      const statusCode = error.message.includes("URL de repositorio Git no válida") ? 400 : 500;
      
      return res.status(statusCode).json({
        success: false,
        message: "Error al conectar el repositorio Git",
        error: error.message,
      });
    }
  },

  // Obtener una entrega específica
  async getSubmission(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);

      const submission = await projectService.getProjectSubmissionById(submissionId);

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: "Entrega no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: submission,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener la entrega",
        error: error.message,
      });
    }
  },

  // Actualizar una entrega (calificación, feedback)
  async updateSubmission(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);
      const { content, grade, feedback } = req.body;

      const submission = await projectService.updateProjectSubmission(
        submissionId,
        {
          content: content ?? null,
          grade: grade ?? null,
          feedback: feedback ?? null,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Entrega actualizada correctamente",
        data: submission,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar la entrega",
        error: error.message,
      });
    }
  }
};
