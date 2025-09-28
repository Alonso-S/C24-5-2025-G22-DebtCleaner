import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const schemas = {
  createCourse: Joi.object({
    name: Joi.string().required().min(3).max(100).messages({
      'string.empty': 'El nombre del curso es obligatorio',
      'string.min': 'El nombre del curso debe tener al menos 3 caracteres',
      'string.max': 'El nombre del curso no puede exceder los 100 caracteres'
    }),
    description: Joi.string().allow('', null)
  }),

  enrollStudent: Joi.object({
    userId: Joi.number().required().messages({
      'number.base': 'El ID del estudiante debe ser un número',
      'any.required': 'El ID del estudiante es obligatorio'
    }),
    courseId: Joi.number().required().messages({
      'number.base': 'El ID del curso debe ser un número',
      'any.required': 'El ID del curso es obligatorio'
    })
  }),

  joinCourse: Joi.object({
    accessCode: Joi.string().required().length(6).messages({
      'string.empty': 'El código de acceso es obligatorio',
      'string.length': 'El código de acceso debe tener exactamente 6 caracteres'
    })
  })
};

export const validateRequest = (schemaName: keyof typeof schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas[schemaName];
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
};