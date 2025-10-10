import { Router } from "express";
import { submissionController } from "../controllers/submissionController";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { projectValidator } from "../validators/projectValidator";
import { projectController } from "../controllers/projectController";

const router = Router();

// Rutas para entregas de proyectos
router.post(
  "/submissions/upload",
  uploadMiddleware.uploadZip,
  uploadMiddleware.handleUploadErrors,
  projectValidator.validateUploadSubmissionFile,
  submissionController.uploadSubmissionFile
);
router.post(
  "/submissions/git",
  projectValidator.validateConnectGitRepository,
  submissionController.connectGitRepository
);

router.get(
  "/:projectId/submissions/:userId",
  projectController.getStudentSubmission
);

router.get("/submissions/:submissionId", submissionController.getSubmission);
router.put(
  "/:submissionId",
  projectValidator.validateUpdateProjectSubmission,
  submissionController.updateSubmission
);
router.get("/:projectId/submissions", projectController.getProjectSubmissions);

router.put(
  "/submissions/:submissionId/grade",
  projectValidator.validateGradeSubmission,
  projectController.gradeSubmission
);
router.get(
  "/submissions/:submissionId/versions",
  projectController.getSubmissionVersions
);

export default router;
