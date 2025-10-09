import { useState } from 'react'
import type { CourseDetails } from '../../dashboard/components/CourseSuccessModal'
import { CloseIcon } from '../../../shared/components/icons/CloseIcon'
import { DocumentArrowIcon } from '../../../shared/components/icons/DocumentArrowIcon'
import { CheckIcon } from '../../../shared/components/icons/CheckIcon'
import { copyToClipboard } from '../../../shared/utils/copyToClipboard'

interface CourseModalProps {
  course: CourseDetails
  onClose: () => void
  formatDate: (date: string) => string
}

export const CourseModal = ({ course, onClose, formatDate }: CourseModalProps) => {
  const [copied, setCopied] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(18,24,38,0.4)] backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm animate-fade-in-up">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[rgba(0,178,227,0.15)] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[rgba(255,82,170,0.1)] rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </button>

          <h3 className="text-xl font-bold text-[rgb(18,24,38)] mb-4">{course.name}</h3>

          <div className="space-y-4">
            {course.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-[rgb(18,24,38)]">{course.description}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Código de Acceso</p>
                <button
                  onClick={() => {
                    copyToClipboard(
                      course.accessCode,
                      'Código copiado al portapapeles',
                      'No se pudo copiar el código',
                      setCopied
                    )
                  }}
                  className="text-sm text-[rgb(0,178,227)] hover:text-[rgb(0,140,179)] flex items-center transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <DocumentArrowIcon />
                      Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="my-3 p-3 bg-[rgb(18,24,38)] text-white rounded font-mono text-center">
              {course.accessCode}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
              <p className="text-[rgb(18,24,38)]">{formatDate(course.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actualización</p>
              <p className="text-[rgb(18,24,38)]">{formatDate(course.updatedAt)}</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
