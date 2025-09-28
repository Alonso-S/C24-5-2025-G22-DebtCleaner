import { Router } from 'express';
import { submissionController } from '../controllers/submissionController';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';
import { projectValidator } from '../validators/projectValidator';
import { projectController } from '../controllers/projectController';

const router = Router();

// Rutas para entregas de proyectos
router.post('/upload', uploadMiddleware.uploadZip, uploadMiddleware.handleUploadErrors, projectValidator.validateUploadSubmissionFile, submissionController.uploadSubmissionFile);
router.post('/git', projectValidator.validateConnectGitRepository, submissionController.connectGitRepository);
router.get('/:submissionId', submissionController.getSubmission);
router.put('/:submissionId', projectValidator.validateUpdateProjectSubmission, submissionController.updateSubmission);
router.get('/:projectId/submissions', projectController.getProjectSubmissions);
router.get('/:projectId/submissions/:userId', projectController.getStudentSubmission);
router.post('/:projectId/submit', projectValidator.validateSubmitProject, projectController.submitProject);
router.post('/:projectId/submit/file', uploadMiddleware.uploadZip, uploadMiddleware.handleUploadErrors, projectValidator.validateUploadSubmissionFile, projectController.submitProject);
router.post('/:projectId/submit/git', projectValidator.validateConnectGitRepository, projectController.submitProject);
router.put('/:submissionId/grade', projectValidator.validateGradeSubmission, projectController.gradeSubmission);
router.get('/:submissionId/versions', projectController.getSubmissionVersions);

export default router;