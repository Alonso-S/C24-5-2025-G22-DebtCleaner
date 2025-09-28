import Joi from "joi";
import type { Request, Response, NextFunction } from "express";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateProjectSubmissionDTO,
  UpdateProjectSubmissionDTO,
  UploadSubmissionFileDTO,
  ConnectGitRepositoryDTO,
} from "../types/project";

export const projectValidator = {
  // Esquemas de validación
  schemas: {
    createProject: Joi.object<CreateProjectDTO>({
      title: Joi.string().required().min(3).max(100),
      description: Joi.string().allow(null, ""),
      dueDate: Joi.date().allow(null),
      courseId: Joi.number().integer().positive().required(),
    }),

    updateProject: Joi.object<UpdateProjectDTO>({
      title: Joi.string().min(3).max(100),
      description: Joi.string().allow(null, ""),
      dueDate: Joi.date().allow(null),
    }).min(1), // Al menos un campo debe ser proporcionado

    createProjectSubmission: Joi.object<CreateProjectSubmissionDTO>({
      content: Joi.string().allow(null, ""),
      projectId: Joi.number().integer().positive().required(),
      userId: Joi.number().integer().positive().required(),
    }),

    updateProjectSubmission: Joi.object<UpdateProjectSubmissionDTO>({
      content: Joi.string().allow(null, ""),
      grade: Joi.number().min(0).max(100).allow(null),
      feedback: Joi.string().allow(null, ""),
    }).min(1), // Al menos un campo debe ser proporcionado
  },

  // Middleware de validación
  validateCreateProject: (req: Request, res: Response, next: NextFunction) => {
    const { error } = projectValidator.schemas.createProject.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateUpdateProject: (req: Request, res: Response, next: NextFunction) => {
    const { error } = projectValidator.schemas.updateProject.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateCreateProjectSubmission: (req: Request, res: Response, next: NextFunction) => {
    const { error } = projectValidator.schemas.createProjectSubmission.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateUpdateProjectSubmission: (req: Request, res: Response, next: NextFunction) => {
    const { error } = projectValidator.schemas.updateProjectSubmission.validate(req.body);

  if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateUploadSubmissionFile: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object<UploadSubmissionFileDTO>({
      projectId: Joi.number().integer().positive().required(),
      userId: Joi.number().integer().positive().required(),
      fileUrl: Joi.string().required(),
      content: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateConnectGitRepository: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object<ConnectGitRepositoryDTO>({
      projectId: Joi.number().integer().positive().required(),
      userId: Joi.number().integer().positive().required(),
      gitRepositoryUrl: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateSubmitProject: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      content: Joi.string().allow(null, ""),
      userId: Joi.number().integer().positive(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },

  validateGradeSubmission: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      grade: Joi.number().min(0).max(10).required(),
      feedback: Joi.string().allow(null, ""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details,
      });
    }

    next();
  },
};
