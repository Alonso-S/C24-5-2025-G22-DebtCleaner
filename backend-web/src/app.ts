import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "./generated/prisma";
import { errorHandler } from "./common/middleware/errorHandler";
import { authRouter } from "./modules/auth/routes/authRouter";
import { userRouter } from "./modules/user/routes/userRouter";
import cookieParser from "cookie-parser";
import courseRouter from "./modules/course/routes/courseRouter";
// Inicializar cliente de Prisma
export const prisma = new PrismaClient();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
