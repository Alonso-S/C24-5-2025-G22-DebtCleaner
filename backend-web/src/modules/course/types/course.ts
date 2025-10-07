import type {
  Course,
  Enrollment,
  Project,
  User,
} from "../../../generated/prisma";
import type { Role } from "../../user/types/user";

export type CourseDTO = {
  id: number;
  name: string;
  description?: string | null;
  accessCode: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: number;
  creator?: UserDTO;
};

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type CreateCourseDTO = {
  name: string;
  description?: string;
  creatorId: number;
};

export type EnrollmentDTO = {
  id: number;
  userId: number;
  courseId: number;
  user?: UserDTO;
  course?: CourseDTO;
  createdAt: Date;
  updatedAt: Date;
};

export type EnrollStudentDTO = {
  userId: number;
  courseId: number;
};

export type JoinCourseDTO = {
  userId: number;
  accessCode: string;
};

export type ProjectDTO = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  courseId: number;
  course?: CourseDTO;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectDTO = {
  title: string;
  description?: string;
  dueDate?: Date;
  courseId: number;
};

export type ProjectSubmissionDTO = {
  id: number;
  content: string;
  grade?: number | null;
  feedback?: string | null;
  projectId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectSubmissionDTO = {
  content: string;
  projectId: number;
  userId: number;
};

export type GradeSubmissionDTO = {
  submissionId: number;
  grade: number;
  feedback?: string;
};
