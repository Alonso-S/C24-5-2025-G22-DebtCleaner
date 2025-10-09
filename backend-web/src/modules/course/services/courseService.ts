import { courseRepository } from "../repositories/courseRepository";
import type {
  CreateCourseDTO,
  EnrollStudentDTO,
  JoinCourseDTO,
} from "../types/course";

export const courseService = {
  async getStudentsByCourse(courseId: number) {
    return courseRepository.getStudentsByCourse(courseId);
  },
  async createCourse(data: CreateCourseDTO) {
    return courseRepository.createCourse(data);
  },
  async deleteCourseById(id: number) {
    return courseRepository.deleteCourseById(id);
  },
  async updateCourseById(id: number, data: CreateCourseDTO) {
    return courseRepository.updateCourseById(id, data);
  },

  async getCourseById(id: number) {
    const course = await courseRepository.getCourseById(id);
    if (!course) {
      throw new Error("Curso no encontrado");
    }
    return course;
  },

  async getCoursesByProfessor(professorId: number) {
    return courseRepository.getCoursesByCreatorId(professorId);
  },

  async getEnrolledCoursesByStudent(studentId: number) {
    const enrollments = await courseRepository.getEnrolledCoursesByStudentId(
      studentId
    );
    return enrollments.map((enrollment) => enrollment.course);
  },

  async enrollStudent(data: EnrollStudentDTO) {
    const isEnrolled = await courseRepository.isStudentEnrolled(
      data.userId,
      data.courseId
    );
    if (isEnrolled) {
      throw new Error("El estudiante ya está matriculado en este curso");
    }
    return courseRepository.enrollStudent(data);
  },

  async joinCourseWithAccessCode(data: JoinCourseDTO) {
    const course = await courseRepository.getCourseByAccessCode(
      data.accessCode
    );
    if (!course) {
      throw new Error("Código de acceso inválido");
    }

    const isEnrolled = await courseRepository.isStudentEnrolled(
      data.userId,
      course.id
    );
    if (isEnrolled) {
      throw new Error("Ya estás matriculado en este curso");
    }

    return courseRepository.enrollStudent({
      userId: data.userId,
      courseId: course.id,
    });
  },
  async removeStudent(courseId: number, studentId: string) {
    return courseRepository.removeStudent(courseId, studentId);
  },
};
