import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "./generated/prisma";
import { errorHandler } from "./common/middleware/errorHandler";
import { authRouter } from "./modules/auth/routes/authRouter";
import { userRouter } from "./modules/user/routes/userRouter";
import cookieParser from "cookie-parser";
import courseRouter from "./modules/course/routes/courseRouter";
import projectRouter from "./modules/project/routes/projectRouter";
import { githubRouter } from "./modules/github/routes/githubRouter";
import { APP_FRONTEND_URL } from "./config";
// Inicializar cliente de Prisma
export const prisma = new PrismaClient();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(
  cors({
    origin: APP_FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/projects", projectRouter);
app.use("/api/github", githubRouter);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
