import type { Request, Response } from "express";
import { commentService } from "../services/commentService";

export const commentController = {
  async createComment(req: Request, res: Response) {
    try {
      const { content, submissionId, parentId } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }
      
      const comment = await commentService.createComment({
        content,
        submissionId: Number(submissionId),
        userId: Number(userId),
        parentId: parentId ? Number(parentId) : null,
      });
      
      return res.status(201).json({
        success: true,
        message: "Comentario creado correctamente",
        data: comment,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al crear el comentario",
        error: error.message,
      });
    }
  },

  async getCommentsBySubmission(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);
      
      const comments = await commentService.getCommentsBySubmissionId(submissionId);
      
      return res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los comentarios",
        error: error.message,
      });
    }
  },

  async updateComment(req: Request, res: Response) {
    try {
      const commentId = Number(req.params.commentId);
      const { content } = req.body;
      
      const comment = await commentService.updateComment(commentId, { content });
      
      return res.status(200).json({
        success: true,
        message: "Comentario actualizado correctamente",
        data: comment,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el comentario",
        error: error.message,
      });
    }
  },

  async deleteComment(req: Request, res: Response) {
    try {
      const commentId = Number(req.params.commentId);
      
      await commentService.deleteComment(commentId);
      
      return res.status(200).json({
        success: true,
        message: "Comentario eliminado correctamente",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el comentario",
        error: error.message,
      });
    }
  },

  async updateReviewStatus(req: Request, res: Response) {
    try {
      const submissionId = Number(req.params.submissionId);
      const { reviewStatus } = req.body;
      
      if (!["PENDING", "REVIEWED"].includes(reviewStatus)) {
        return res.status(400).json({
          success: false,
          message: "Estado de revisión inválido",
        });
      }
      
      await commentService.updateSubmissionReviewStatus(submissionId, reviewStatus);
      
      return res.status(200).json({
        success: true,
        message: `Entrega marcada como ${reviewStatus === "REVIEWED" ? "revisada" : "pendiente"}`,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de revisión",
        error: error.message,
      });
    }
  },
};