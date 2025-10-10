import type { CourseDetails } from '../../dashboard/components/CourseSuccessModal'
import type { CourseFormData } from '../../dashboard/components/CourseForm'
import { api } from '../../../core/api/apiClient'
import type { Student } from '../../../shared/types'

export const courseService = {
  createCourse: async (courseData: CourseFormData): Promise<CourseDetails> => {
    const response = await api.post<CourseDetails>('/courses/', courseData)

    return response.data
  },

  getCourses: async (): Promise<CourseDetails[]> => {
    const response = await api.get<CourseDetails[]>('/courses/professor')

    return response.data
  },
  deleteCourseById: async (courseId: number): Promise<void> => {
    await api.delete(`/courses/${courseId}`)
  },

  getStudentsByCourse: async (courseId: number): Promise<Student[]> => {
    const response = await api.get<Student[]>(`/courses/${courseId}/students`)

    return response.data
  },
  removeStudent: async (courseId: number, studentId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/students/${studentId}`)
  },
  joinCourse: async (courseCode: string): Promise<void> => {
    await api.post('/courses/join', { accessCode: courseCode })
  },
  getStudentCourses: async (): Promise<CourseDetails[]> => {
    const response = await api.get<CourseDetails[]>('/courses/enrolled')
    return response.data
  },

  getCourseById: async (courseId: number): Promise<CourseDetails> => {
    const response = await api.get<CourseDetails>(`/courses/${courseId}`)
    return response.data
  },
  updateCourseById: async (
    courseId: number,
    courseData: CourseFormData
  ): Promise<CourseDetails> => {
    const response = await api.put<CourseDetails>(`/courses/${courseId}`, courseData)
    return response.data
  },
}
