import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";

// Configurar el directorio de almacenamiento
const uploadDir = path.join(process.cwd(), "uploads", "projects");

// Asegurar que el directorio existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadMiddleware = {
  // Configurar el almacenamiento
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generar un nombre único para el archivo
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),

  // Filtro para permitir solo archivos ZIP
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (
      file.mimetype === "application/zip" ||
      file.originalname.endsWith(".zip")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos ZIP"));
    }
  },

  // Configurar multer
  uploadZip: multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    }),
    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      if (
        file.mimetype === "application/zip" ||
        file.originalname.endsWith(".zip")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Solo se permiten archivos ZIP"));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // Limitar a 10MB
    },
  }).single("file"),

  // Middleware para manejar errores de multer
  handleUploadErrors: (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      return res.status(400).json({
        success: false,
        message: "Error en la subida del archivo",
        error: err.message,
      });
    } else if (err) {
      // Otro tipo de error
      return res.status(400).json({
        success: false,
        message: "Error en la subida del archivo",
        error: err.message,
      });
    }
    next();
  },
};