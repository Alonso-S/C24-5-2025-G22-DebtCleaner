import { Router } from "express";
import { projectController } from "../controllers/projectController";
import { projectValidator } from "../validators/projectValidator";
import submissionRouter from "./submissionRouter";
import commentRoutes from "./commentRoutes";
const projectRouter = Router();

// Rutas para proyectos
projectRouter.post(
  "/",
  projectValidator.validateCreateProject,
  projectController.createProject
);
projectRouter.get("/:id", projectController.getProjectById);
projectRouter.get("/course/:courseId", projectController.getProjectsByCourse);
projectRouter.put(
  "/:id",
  projectValidator.validateUpdateProject,
  projectController.updateProject
);
projectRouter.delete("/:id", projectController.deleteProject);

// Rutas para entregas de proyectos
projectRouter.use("/submissions", submissionRouter);
projectRouter.use("/comments", commentRoutes);

export default projectRouter;
