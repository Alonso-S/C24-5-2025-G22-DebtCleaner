import type {
  ProjectSubmission,
  ProjectSubmissionVersion,
} from "../../../generated/prisma";
import { prisma } from "../../../common/infrastructure/prismaClient";
import type { CreateProjectSubmissionVersionDTO } from "../types/project";

export const versionRepository = {
  /**
   * Crea una nueva versión para una entrega existente
   */
  createVersion: async (
    data: CreateProjectSubmissionVersionDTO
  ): Promise<ProjectSubmissionVersion> => {
    // Obtener el número de la última versión
    const lastVersion = await prisma.projectSubmissionVersion.findFirst({
      where: { submissionId: data.submissionId },
      orderBy: { versionNumber: "desc" },
    });

    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // Crear la nueva versión
    return prisma.projectSubmissionVersion.create({
      data: {
        ...data,
        versionNumber,
      },
    });
  },

  /**
   * Crea automáticamente una versión cuando se actualiza una entrega
   */
  createVersionFromSubmission: async (
    submission: ProjectSubmission
  ): Promise<ProjectSubmissionVersion> => {
    return versionRepository.createVersion({
      submissionId: submission.id,
      content: submission.content,
      fileUrl: submission.fileUrl,
      gitCommitHash: null, // Se podría implementar la obtención del hash del commit en el futuro
    });
  },

  /**
   * Obtiene todas las versiones de una entrega
   */
  getVersionsBySubmissionId: async (
    submissionId: number
  ): Promise<ProjectSubmissionVersion[]> => {
    return prisma.projectSubmissionVersion.findMany({
      where: { submissionId },
      orderBy: { versionNumber: "desc" },
    });
  },

  /**
   * Obtiene una versión específica
   */
  getVersionById: async (
    versionId: number
  ): Promise<ProjectSubmissionVersion | null> => {
    return prisma.projectSubmissionVersion.findUnique({
      where: { id: versionId },
    });
  },
};
