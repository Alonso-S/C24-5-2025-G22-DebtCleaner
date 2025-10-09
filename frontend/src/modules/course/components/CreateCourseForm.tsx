import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { CourseForm } from '../../dashboard/components/CourseForm'
import type { CourseFormData } from '../../dashboard/components/CourseForm'
import { CourseSuccessModal } from '../../dashboard/components/CourseSuccessModal'
import type { CourseDetails } from '../../dashboard/components/CourseSuccessModal'

import { courseService } from '../services/courseService'

export const CreateCourseForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null)

  const handleSubmit = async (formData: CourseFormData) => {
    setIsLoading(true)

    try {
      const createdCourse = await courseService.createCourse(formData)
      setCourseDetails(createdCourse)
      setShowModal(true)
      toast.success('Curso creado con éxito')
    } catch (error) {
      toast.error('Error al crear el curso')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[rgb(18,24,38)] mb-6 text-center">
        Crear Nuevo Curso
      </h2>

      <CourseForm onSubmit={handleSubmit} isLoading={isLoading} />

      <CourseSuccessModal
        isOpen={showModal}
        onClose={handleCloseModal}
        courseDetails={courseDetails}
      />
    </div>
  )
}
