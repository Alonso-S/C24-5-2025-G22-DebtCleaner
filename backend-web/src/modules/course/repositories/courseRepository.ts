import { PrismaClient } from "../../../generated/prisma";
import type {
  CreateCourseDTO,
  EnrollStudentDTO,
  JoinCourseDTO,
} from "../types/course";
import { generateUniqueAccessCode } from "../utils/codeGenerator";

const prisma = new PrismaClient();

export const courseRepository = {
  async createCourse(data: CreateCourseDTO) {
    const accessCode = await generateUniqueAccessCode();

    return prisma.course.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        accessCode,
        creator: {
          connect: { id: data.creatorId },
        },
      },
      include: {
        creator: true,
      },
    });
  },

  async getCourseById(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        creator: true,
        enrollments: {
          include: {
            user: true,
          },
        },
        projects: true,
      },
    });
  },

  async getCourseByAccessCode(accessCode: string) {
    return prisma.course.findUnique({
      where: { accessCode },
      include: {
        creator: true,
      },
    });
  },

  async getCoursesByCreatorId(creatorId: number) {
    return prisma.course.findMany({
      where: {
        creatorId,
      },
      include: {
        creator: true,
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async getEnrolledCoursesByStudentId(studentId: number) {
    return prisma.enrollment.findMany({
      where: {
        userId: studentId,
      },
      include: {
        course: {
          include: {
            creator: true,
          },
        },
      },
    });
  },

  async enrollStudent(data: EnrollStudentDTO) {
    return prisma.enrollment.create({
      data: {
        user: {
          connect: { id: data.userId },
        },
        course: {
          connect: { id: data.courseId },
        },
      },
      include: {
        user: true,
        course: true,
      },
    });
  },

  async joinCourse(data: JoinCourseDTO) {
    const course = await prisma.course.findUnique({
      where: { accessCode: data.accessCode },
    });

    if (!course) {
      throw new Error(
        "Curso no encontrado con el código de acceso proporcionado"
      );
    }

    return this.enrollStudent({
      userId: data.userId,
      courseId: course.id,
    });
  },

  async isStudentEnrolled(userId: number, courseId: number) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return !!enrollment;
  },
};
