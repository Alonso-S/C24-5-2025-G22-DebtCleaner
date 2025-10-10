import type {
  Project,
  ProjectSubmission,
  ProjectSubmissionVersion,
} from "../../../generated/prisma";

export type ProjectDTO = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectDTO = {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  courseId: number;
};

export type UpdateProjectDTO = {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
};

export type ProjectSubmissionDTO = {
  id: number;
  content?: string | null;
  fileUrl?: string | null;
  gitRepositoryUrl?: string | null;
  grade?: number | null;
  feedback?: string | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
  userId: number;
  versions?: ProjectSubmissionVersionDTO[];
};

export type CreateProjectSubmissionDTO = {
  content?: string | null;
  fileUrl?: string | null;
  gitRepositoryUrl?: string | null;
  projectId: number;
  userId: number;
};

export type UpdateProjectSubmissionDTO = {
  content?: string | null;
  grade?: number | null;
  feedback?: string | null;
};

export type ProjectSubmissionVersionDTO = {
  id: number;
  versionNumber: number;
  fileUrl?: string | null;
  gitCommitHash?: string | null;
  content?: string | null;
  createdAt: Date;
  submissionId: number;
};

export type CreateProjectSubmissionVersionDTO = {
  fileUrl?: string | null;
  gitCommitHash?: string | null;
  content?: string | null;
  submissionId: number;
  versionNumber?: number;
};

export type UploadSubmissionFileDTO = {
  projectId: number;
  userId: number;
  content?: string | null;
  fileUrl: string;
};

export type ConnectGitRepositoryDTO = {
  projectId: number;
  userId: number;
  gitRepositoryUrl: string;
  gitCommitHash?: string | null;
  content?: string | null;
};

export const mapProjectToDTO = (project: Project): ProjectDTO => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    dueDate: project.dueDate,
    courseId: project.courseId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

export const mapProjectSubmissionToDTO = (
  submission: ProjectSubmission & { versions?: ProjectSubmissionVersion[] }
): ProjectSubmissionDTO => {
  return {
    id: submission.id,
    content: submission.content,
    fileUrl: submission.fileUrl ?? null,
    gitRepositoryUrl: submission.gitRepositoryUrl ?? null,
    grade: submission.grade ?? null,
    feedback: submission.feedback ?? null,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    projectId: submission.projectId,
    userId: submission.userId,
    versions: submission.versions?.map(mapProjectSubmissionVersionToDTO) ?? [],
  };
};

export const mapProjectSubmissionVersionToDTO = (
  version: ProjectSubmissionVersion
): ProjectSubmissionVersionDTO => {
  return {
    id: version.id,
    versionNumber: version.versionNumber,
    fileUrl: version.fileUrl,
    gitCommitHash: version.gitCommitHash,
    content: version.content,
    createdAt: version.createdAt,
    submissionId: version.submissionId,
  };
};
