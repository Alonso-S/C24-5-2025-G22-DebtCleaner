import { PrismaClient } from "../../../generated/prisma";
import type {
  CreateCourseDTO,
  EnrollStudentDTO,
  JoinCourseDTO,
} from "../types/course";
import { generateUniqueAccessCode } from "../utils/codeGenerator";

const prisma = new PrismaClient();

export const courseRepository = {
  async getStudentsByCourse(courseId: number) {
    return prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            courseId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },
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
    });
  },
  async updateCourseById(id: number, data: CreateCourseDTO) {
    return prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
  },

  async deleteCourseById(id: number) {
    return prisma.course.delete({
      where: { id },
    });
  },

  async getCourseById(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
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
        creator: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  },

  async getCoursesByCreatorId(creatorId: number) {
    return prisma.course.findMany({
      where: { creatorId },
      select: {
        id: true,
        name: true,
        description: true,
        accessCode: true,
        createdAt: true,
        updatedAt: true,
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
            creator: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
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
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        course: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
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

  async removeStudent(courseId: number, studentId: string) {
    return prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: Number(studentId),
          courseId,
        },
      },
    });
  },
};
