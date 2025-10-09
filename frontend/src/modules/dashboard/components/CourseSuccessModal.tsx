import { useState } from 'react'
import { copyToClipboard } from '../../../shared/utils/copyToClipboard'
import { CheckIcon } from '../../../shared/components/icons/CheckIcon'
import { DocumentArrowIcon } from '../../../shared/components/icons/DocumentArrowIcon'

export interface CourseDetails {
  id: number
  name: string
  description: string
  accessCode: string
  createdAt: string
  updatedAt: string
  creatorId: number
}

interface CourseSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  courseDetails: CourseDetails | null
}

export const CourseSuccessModal = ({ isOpen, onClose, courseDetails }: CourseSuccessModalProps) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !courseDetails) return null

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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon />
          </div>

          <h3 className="text-xl font-bold text-center text-[rgb(18,24,38)] mb-2">
            ¡Curso creado con éxito!
          </h3>

          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-[rgb(18,24,38)]">Detalles del curso:</h4>
              <p className="mt-2 text-gray-700">
                <span className="font-medium">Nombre:</span> {courseDetails.name}
              </p>
              {courseDetails.description && (
                <p className="mt-1 text-gray-700">
                  <span className="font-medium">Descripción:</span> {courseDetails.description}
                </p>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[rgb(18,24,38)]">Código de acceso:</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        courseDetails.accessCode,
                        'Código copiado al portapapeles',
                        'No se pudo copiar el código',
                        setCopied
                      )
                    }
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
                <div className="mt-2 p-3 bg-[rgb(18,24,38)] text-white rounded font-mono text-center">
                  {courseDetails.accessCode}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
