import { prisma } from "../../../common/infrastructure/prismaClient";
import type {
  CreateSubmissionCommentDTO,
  UpdateSubmissionCommentDTO,
} from "../types/comment";

export const commentRepository = {
  async createComment(data: CreateSubmissionCommentDTO) {
    return prisma.submissionComment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  async getCommentById(id: number) {
    return prisma.submissionComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  },

  async getCommentsBySubmissionId(submissionId: number) {
    return prisma.submissionComment.findMany({
      where: {
        submissionId,
        parentId: null, // Solo comentarios principales (no respuestas)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async updateComment(id: number, data: UpdateSubmissionCommentDTO) {
    return prisma.submissionComment.update({
      where: { id },
      data,
    });
  },

  async deleteComment(id: number) {
    return prisma.submissionComment.delete({
      where: { id },
    });
  },

  async updateSubmissionReviewStatus(
    submissionId: number,
    reviewStatus: "PENDING" | "REVIEWED"
  ) {
    return prisma.projectSubmission.update({
      where: { id: submissionId },
      data: { reviewStatus },
    });
  },
};
