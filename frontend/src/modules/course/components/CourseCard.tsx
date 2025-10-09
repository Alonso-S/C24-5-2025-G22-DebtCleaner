import type { MouseEvent } from 'react'
import type { CourseDetails } from '../../dashboard/components/CourseSuccessModal'
import { CopyIcon } from '../../../shared/components/icons/CopyIcon'
import { InformationCircleIcon } from '../../../shared/components/icons/InformationCircleIcon'

interface CourseCardProps {
  course: CourseDetails
  onCardClick: (course: CourseDetails) => void
  onCopyCode: (code: string, e: MouseEvent) => void
  formatDate: (date: string) => string
  onEnterClass?: (courseId: number) => void
}

export const CourseCard = ({ course, onCardClick, onCopyCode, onEnterClass }: CourseCardProps) => {
  const handleCopyClick = (e: MouseEvent) => {
    e.stopPropagation()
    onCopyCode(course.accessCode, e)
  }

  const handleInfoClick = (e: MouseEvent) => {
    e.stopPropagation()
    onCardClick(course)
  }

  const handleEnterClass = (e: MouseEvent) => {
    e.stopPropagation()
    if (onEnterClass) {
      onEnterClass(course.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md will-change-transform h-full flex flex-col overflow-hidden">
      <div className="h-3 bg-gradient-to-r from-[rgb(0,178,227)] to-[rgb(51,204,255)]"></div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Encabezado con nombre y botón de información */}
        <div className="flex justify-between items-center mb-3">
          <h3
            className="text-lg font-bold text-[rgb(18,24,38)] truncate text-left flex-grow pr-2"
            title={course.name}
          >
            {course.name}
          </h3>
          <button
            onClick={handleInfoClick}
            className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 flex-shrink-0"
            title="Ver información del curso"
            aria-label="Ver información del curso"
          >
            <InformationCircleIcon className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Descripción del curso */}
        <div className="flex-grow mb-4">
          {course.description && (
            <p className="text-gray-700 text-sm line-clamp-2 text-left" title={course.description}>
              {course.description}
            </p>
          )}
        </div>

        {/* Código de acceso */}
        <div className="flex items-center mb-4 bg-black/5 p-2 rounded-lg border border-gray-100">
          <div className="flex-grow">
            <div className="text-xs text-gray-500 mb-1">Código de acceso:</div>
            <div className="font-mono text-sm font-medium">{course.accessCode}</div>
          </div>
          <button
            onClick={handleCopyClick}
            className="ml-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            title="Copiar código de acceso"
            aria-label="Copiar código de acceso"
          >
            <CopyIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Botón de acción principal */}
        <button
          onClick={handleEnterClass}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center"
          title="Entrar a la clase"
          aria-label="Entrar a la clase"
        >
          Entrar a la clase
        </button>
      </div>
    </div>
  )
}
