import type {
  ProjectSubmission,
  ProjectSubmissionVersion,
} from "../../../generated/prisma";
import type { CreateProjectSubmissionVersionDTO } from "../types/project";
import { versionRepository } from "../repositories/versionRepository";

export const versionService = () => ({
  /**
   * Crea una nueva versión para una entrega existente
   */
  createVersion: async (
    data: CreateProjectSubmissionVersionDTO
  ): Promise<ProjectSubmissionVersion> => {
    return versionRepository.createVersion(data);
  },

  /**
   * Crea automáticamente una versión cuando se actualiza una entrega
   */
  createVersionFromSubmission: async (
    submission: ProjectSubmission
  ): Promise<ProjectSubmissionVersion> => {
    return versionRepository.createVersionFromSubmission(submission);
  },

  /**
   * Obtiene todas las versiones de una entrega
   */
  getVersionsBySubmissionId: async (
    submissionId: number
  ): Promise<ProjectSubmissionVersion[]> => {
    return versionRepository.getVersionsBySubmissionId(submissionId);
  },

  /**
   * Obtiene una versión específica
   */
  getVersionById: async (
    versionId: number
  ): Promise<ProjectSubmissionVersion | null> => {
    return versionRepository.getVersionById(versionId);
  },
});
