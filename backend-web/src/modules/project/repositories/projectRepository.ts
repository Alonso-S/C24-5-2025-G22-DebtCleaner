import { prisma } from "../../../common/infrastructure/prismaClient";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateProjectSubmissionDTO,
  UpdateProjectSubmissionDTO,
  CreateProjectSubmissionVersionDTO,
} from "../types/project";

export const projectRepository = {
  // Métodos para Proyectos
  async createProject(data: CreateProjectDTO) {
    return prisma.project.create({
      data,
    });
  },

  async getProjectById(id: number) {
    return prisma.project.findUnique({
      where: { id },
    });
  },

  async getProjectsByCourseId(courseId: number) {
    return prisma.project.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateProject(id: number, data: UpdateProjectDTO) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async deleteProject(id: number) {
    return prisma.project.delete({
      where: { id },
    });
  },

  // Métodos para Entregas de Proyectos
  async createProjectSubmission(data: CreateProjectSubmissionDTO) {
    return prisma.projectSubmission.create({
      data: {
        content: data.content ?? null,
        projectId: data.projectId,
        userId: data.userId,
      },
    });
  },

  async getProjectSubmissionById(id: number) {
    return prisma.projectSubmission.findUnique({
      where: { id },
      include: { versions: true },
    });
  },

  async getProjectSubmissionsByProjectId(projectId: number) {
    return prisma.projectSubmission.findMany({
      where: { projectId },
      include: { versions: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getProjectSubmissionsByUserId(userId: number) {
    return prisma.projectSubmission.findMany({
      where: { userId },
      include: { versions: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getProjectSubmissionByProjectAndUser(
    projectId: number,
    userId: number
  ) {
    return prisma.projectSubmission.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { versions: true },
    });
  },

  async updateProjectSubmission(id: number, data: UpdateProjectSubmissionDTO) {
    return prisma.projectSubmission.update({
      where: { id },
      data,
    });
  },

  async updateSubmissionFileUrl(id: number, fileUrl: string) {
    return prisma.projectSubmission.update({
      where: { id },
      data: {
        fileUrl,
        gitRepositoryUrl: null,
      },
    });
  },

  async updateSubmissionGitRepository(id: number, gitRepositoryUrl: string) {
    return prisma.projectSubmission.update({
      where: { id },
      data: {
        gitRepositoryUrl,
        fileUrl: null,
      },
    });
  },

  // Métodos para Versiones de Entregas
  async createProjectSubmissionVersion(
    data: CreateProjectSubmissionVersionDTO
  ) {
    // Obtener el número de la última versión
    const lastVersion = await prisma.projectSubmissionVersion.findFirst({
      where: { submissionId: data.submissionId },
      orderBy: { versionNumber: "desc" },
    });

    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    return prisma.projectSubmissionVersion.create({
      data: {
        versionNumber,
        fileUrl: data.fileUrl ?? null,
        gitCommitHash: data.gitCommitHash ?? null,
        content: data.content ?? null,
        submissionId: data.submissionId,
      },
    });
  },

  async getProjectSubmissionVersions(submissionId: number) {
    return prisma.projectSubmissionVersion.findMany({
      where: { submissionId },
      orderBy: { versionNumber: "desc" },
    });
  },

  async getProjectSubmissionVersionById(id: number) {
    return prisma.projectSubmissionVersion.findUnique({
      where: { id },
    });
  },
};
