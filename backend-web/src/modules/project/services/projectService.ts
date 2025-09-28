import { AppError } from "../../../common/errors/AppError";
import { projectRepository } from "../repositories/projectRepository";
import { githubService } from "../../github/services/githubService";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateProjectSubmissionDTO,
  UpdateProjectSubmissionDTO,
  ProjectDTO,
  ProjectSubmissionDTO,
  ProjectSubmissionVersionDTO,
  CreateProjectSubmissionVersionDTO,
  UploadSubmissionFileDTO,
  ConnectGitRepositoryDTO,
} from "../types/project";
import {
  mapProjectToDTO,
  mapProjectSubmissionToDTO,
  mapProjectSubmissionVersionToDTO,
} from "../types/project";

export const projectService = {
  // Métodos para Proyectos
  async createProject(data: CreateProjectDTO): Promise<ProjectDTO> {
    const project = await projectRepository.createProject(data);
    return mapProjectToDTO(project);
  },

  async getProjectById(id: number): Promise<ProjectDTO | null> {
    const project = await projectRepository.getProjectById(id);
    return project ? mapProjectToDTO(project) : null;
  },

  async getProjectsByCourseId(courseId: number): Promise<ProjectDTO[]> {
    const projects = await projectRepository.getProjectsByCourseId(courseId);
    return projects.map(mapProjectToDTO);
  },

  async updateProject(id: number, data: UpdateProjectDTO): Promise<ProjectDTO> {
    const project = await projectRepository.updateProject(id, data);
    return mapProjectToDTO(project);
  },

  async deleteProject(id: number): Promise<ProjectDTO> {
    const project = await projectRepository.deleteProject(id);
    return mapProjectToDTO(project);
  },

  // Métodos para Entregas de Proyectos
  async createProjectSubmission(
    data: CreateProjectSubmissionDTO
  ): Promise<ProjectSubmissionDTO> {
    const submission = await projectRepository.createProjectSubmission(data);
    return mapProjectSubmissionToDTO(submission);
  },

  async getProjectSubmissionById(
    id: number
  ): Promise<ProjectSubmissionDTO | null> {
    const submission = await projectRepository.getProjectSubmissionById(id);
    return submission ? mapProjectSubmissionToDTO(submission) : null;
  },

  async getProjectSubmissionsByProjectId(
    projectId: number
  ): Promise<ProjectSubmissionDTO[]> {
    const submissions =
      await projectRepository.getProjectSubmissionsByProjectId(projectId);
    return submissions.map(mapProjectSubmissionToDTO);
  },

  async getProjectSubmissionsByUserId(
    userId: number
  ): Promise<ProjectSubmissionDTO[]> {
    const submissions = await projectRepository.getProjectSubmissionsByUserId(
      userId
    );
    return submissions.map(mapProjectSubmissionToDTO);
  },

  async getProjectSubmissionByProjectAndUser(
    projectId: number,
    userId: number
  ): Promise<ProjectSubmissionDTO | null> {
    const submission =
      await projectRepository.getProjectSubmissionByProjectAndUser(
        projectId,
        userId
      );
    return submission ? mapProjectSubmissionToDTO(submission) : null;
  },

  async updateProjectSubmission(
    id: number,
    data: UpdateProjectSubmissionDTO
  ): Promise<ProjectSubmissionDTO> {
    const submission = await projectRepository.updateProjectSubmission(
      id,
      data
    );
    return mapProjectSubmissionToDTO(submission);
  },

  async updateSubmissionFileUrl(
    id: number,
    fileUrl: string
  ): Promise<ProjectSubmissionDTO> {
    const submission = await projectRepository.updateSubmissionFileUrl(
      id,
      fileUrl
    );

    // Crear una nueva versión automáticamente
    await projectService.createVersionFromSubmission(submission.id);

    return mapProjectSubmissionToDTO(submission);
  },

  async updateSubmissionGitRepository(
    id: number,
    gitRepositoryUrl: string
  ): Promise<ProjectSubmissionDTO> {
    const submission = await projectRepository.updateSubmissionGitRepository(
      id,
      gitRepositoryUrl
    );

    // Crear una nueva versión automáticamente
    await projectService.createVersionFromSubmission(submission.id);

    return mapProjectSubmissionToDTO(submission);
  },

  // Métodos para Versiones de Entregas
  async createProjectSubmissionVersion(
    data: CreateProjectSubmissionVersionDTO
  ): Promise<ProjectSubmissionVersionDTO> {
    const version = await projectRepository.createProjectSubmissionVersion(
      data
    );
    return mapProjectSubmissionVersionToDTO(version);
  },

  async getProjectSubmissionVersions(
    submissionId: number
  ): Promise<ProjectSubmissionVersionDTO[]> {
    const versions = await projectRepository.getProjectSubmissionVersions(
      submissionId
    );
    return versions.map(mapProjectSubmissionVersionToDTO);
  },

  async getProjectSubmissionVersionById(
    id: number
  ): Promise<ProjectSubmissionVersionDTO | null> {
    const version = await projectRepository.getProjectSubmissionVersionById(id);
    return version ? mapProjectSubmissionVersionToDTO(version) : null;
  },

  // Método para crear una versión a partir de una entrega
  async createVersionFromSubmission(
    submissionId: number
  ): Promise<ProjectSubmissionVersionDTO> {
    const submission = await projectRepository.getProjectSubmissionById(
      submissionId
    );

    if (!submission) {
      throw new Error("Entrega no encontrada");
    }

    // Obtener el número de la última versión
    const versions = await projectRepository.getProjectSubmissionVersions(
      submissionId
    );
    const versionNumber =
      versions.length > 0
        ? Math.max(...versions.map((v) => v.versionNumber)) + 1
        : 1;

    const versionData: CreateProjectSubmissionVersionDTO = {
      submissionId,
      content: submission.content,
      fileUrl: submission.fileUrl,
      gitCommitHash: null,
      versionNumber,
    };

    return projectService.createProjectSubmissionVersion(versionData);
  },

  // Método para subir un archivo ZIP
  async uploadSubmissionFile(
    data: UploadSubmissionFileDTO
  ): Promise<ProjectSubmissionDTO> {
    // Buscar si ya existe una entrega para este proyecto y usuario
    let submission = await projectService.getProjectSubmissionByProjectAndUser(
      data.projectId,
      data.userId
    );

    if (submission) {
      // Actualizar la entrega existente
      submission = await projectService.updateSubmissionFileUrl(
        submission.id,
        data.fileUrl
      );
    } else {
      // Crear una nueva entrega
      const submissionData: CreateProjectSubmissionDTO = {
        projectId: data.projectId,
        userId: data.userId,
        content: null,
        fileUrl: data.fileUrl,
      };
      submission = await projectService.createProjectSubmission(submissionData);
    }

    return submission;
  },

  // Método para conectar un repositorio Git
  async connectGitRepository(
    data: ConnectGitRepositoryDTO
  ): Promise<ProjectSubmissionDTO> {
    // Validar que la URL sea de GitHub o GitLab
    const isValidUrl =
      /^https:\/\/(github\.com|gitlab\.com)\/[\w-]+\/[\w-]+/.test(
        data.gitRepositoryUrl
      );

    if (!isValidUrl) {
      throw new AppError("URL de repositorio Git no válida", 400);
    }

    // Si es GitHub, validar el repositorio y obtener el commit hash
    let gitCommitHash = null;
    if (data.gitRepositoryUrl.includes("github.com")) {
      const validation = await githubService().validateGitHubRepository(
        data.gitRepositoryUrl,
        data.userId
      );

      if (!validation.isValid) {
        throw new AppError(
          "No se pudo acceder al repositorio de GitHub. Asegúrate de haber conectado tu cuenta de GitHub.",
          400
        );
      }

      gitCommitHash = validation.commitHash || null;
    }

    // Buscar si ya existe una entrega para este proyecto y usuario
    let submission = await projectService.getProjectSubmissionByProjectAndUser(
      data.projectId,
      data.userId
    );

    if (submission) {
      // Actualizar la entrega existente con el método específico para gitRepositoryUrl
      submission = await projectService.updateSubmissionGitRepository(
        submission.id,
        data.gitRepositoryUrl
      );

      // Actualizar el contenido si es necesario
      if (data.content !== undefined) {
        submission = await projectService.updateProjectSubmission(
          submission.id,
          {
            content: data.content || null,
          }
        );
      }

      // Crear una nueva versión automáticamente con el commit hash
      const versionData: CreateProjectSubmissionVersionDTO = {
        submissionId: submission.id,
        content: submission.content || null,
        fileUrl: submission.fileUrl || null,
        gitCommitHash,
        // No especificamos versionNumber para que se calcule automáticamente
      };

      await projectService.createProjectSubmissionVersion(versionData);
    } else {
      // Crear una nueva entrega
      submission = await projectService.createProjectSubmission({
        projectId: data.projectId,
        userId: data.userId,
        gitRepositoryUrl: data.gitRepositoryUrl,
        content: data.content || null,
      });

      // Crear la primera versión con el commit hash
      if (submission) {
        const versionData: CreateProjectSubmissionVersionDTO = {
          submissionId: submission.id,
          content: submission.content || null,
          fileUrl: submission.fileUrl || null,
          gitCommitHash,
          versionNumber: 1,
        };

        await projectService.createProjectSubmissionVersion(versionData);
      }
    }

    return submission;
  },

  // Método para enviar un proyecto (crear o actualizar entrega)
  async submitProject(
    data: CreateProjectSubmissionDTO
  ): Promise<ProjectSubmissionDTO> {
    // Buscar si ya existe una entrega para este proyecto y usuario
    const existingSubmission =
      await projectService.getProjectSubmissionByProjectAndUser(
        data.projectId,
        data.userId
      );

    let submission: ProjectSubmissionDTO;

    if (existingSubmission) {
      // Actualizar la entrega existente
      const updateData: UpdateProjectSubmissionDTO = {
        content: data.content ?? null,
      };
      submission = await projectService.updateProjectSubmission(
        existingSubmission.id,
        updateData
      );
    } else {
      // Crear una nueva entrega
      submission = await projectService.createProjectSubmission(data);
      // Crear la primera versión
      await projectService.createVersionFromSubmission(submission.id);
    }

    return submission;
  },

  async gradeSubmission(
    submissionId: number,
    grade: number,
    feedback?: string
  ): Promise<ProjectSubmissionDTO> {
    const submission = await projectRepository.updateProjectSubmission(
      submissionId,
      {
        grade,
        feedback: feedback ?? null,
      }
    );
    return mapProjectSubmissionToDTO(submission);
  },
};
