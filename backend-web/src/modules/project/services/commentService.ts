import { commentRepository } from "../repositories/commentRepository";
import type { 
  CreateSubmissionCommentDTO, 
  UpdateSubmissionCommentDTO,
  SubmissionCommentDTO 
} from "../types/comment";
import { mapSubmissionCommentToDTO } from "../types/comment";

export const commentService = {
  async createComment(data: CreateSubmissionCommentDTO): Promise<SubmissionCommentDTO> {
    const comment = await commentRepository.createComment(data);
    return mapSubmissionCommentToDTO(comment);
  },

  async getCommentById(id: number): Promise<SubmissionCommentDTO | null> {
    const comment = await commentRepository.getCommentById(id);
    return comment ? mapSubmissionCommentToDTO(comment) : null;
  },

  async getCommentsBySubmissionId(submissionId: number): Promise<SubmissionCommentDTO[]> {
    const comments = await commentRepository.getCommentsBySubmissionId(submissionId);
    return comments.map(mapSubmissionCommentToDTO);
  },

  async updateComment(id: number, data: UpdateSubmissionCommentDTO): Promise<SubmissionCommentDTO> {
    const comment = await commentRepository.updateComment(id, data);
    return mapSubmissionCommentToDTO(comment);
  },

  async deleteComment(id: number): Promise<void> {
    await commentRepository.deleteComment(id);
  },

  async updateSubmissionReviewStatus(submissionId: number, reviewStatus: "PENDING" | "REVIEWED"): Promise<void> {
    await commentRepository.updateSubmissionReviewStatus(submissionId, reviewStatus);
  }
};