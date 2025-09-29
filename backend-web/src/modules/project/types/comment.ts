import type { SubmissionComment } from "../../../generated/prisma";
import type { UserDTO } from "../../user/types/user";

export type SubmissionCommentDTO = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  submissionId: number;
  userId: number;
  parentId: number | null;
  user?: UserDTO;
  replies?: SubmissionCommentDTO[];
};

export type CreateSubmissionCommentDTO = {
  content: string;
  submissionId: number;
  userId: number;
  parentId?: number | null;
};

export type UpdateSubmissionCommentDTO = {
  content: string;
};

export const mapSubmissionCommentToDTO = (
  comment: SubmissionComment & { 
    user?: any;
    replies?: SubmissionComment[] 
  }
): SubmissionCommentDTO => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    submissionId: comment.submissionId,
    userId: comment.userId,
    parentId: comment.parentId,
    user: comment.user,
    replies: comment.replies?.map(mapSubmissionCommentToDTO) || [],
  };
};