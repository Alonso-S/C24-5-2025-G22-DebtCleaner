import React, { useEffect } from 'react'
import type { Student } from '../../../shared/types'
import SubmissionComments from './SubmissionComments'
import { FaFileArchive, FaGithub } from 'react-icons/fa'

interface SubmissionVersion {
  id: number
  versionNumber: number
  fileUrl?: string
  gitCommitHash?: string | null
  createdAt: string
}

interface SubmissionSummary {
  id: number
  userId: number
  projectId: number
  grade?: number | null
  createdAt: string
  fileUrl?: string | null
  gitRepositoryUrl?: string | null
  versions?: SubmissionVersion[]
}

interface SubmissionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  student?: Student
  submission: SubmissionSummary | null
  versions: SubmissionVersion[]
}

export const SubmissionHistoryModal: React.FC<SubmissionHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
  submission,
  versions,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 ease-out' : 'opacity-0 pointer-events-none ease-in'}`}
      onClick={onClose}
    >
      <div
        className={`relative p-8 border w-full max-w-3xl md:max-w-4xl lg:max-w-5xl shadow-lg rounded-md bg-white mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 ease-out' : 'scale-95 opacity-0 ease-in'} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Historial de Entregas</h3>
          {student?.name && (
            <p className="text-sm text-gray-500 mt-1">Estudiante: {student.name}</p>
          )}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 focus:outline-none text-2xl"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Submission Details & Versions */}
          <div className="lg:w-1/2">
            <h4 className="text-xl font-medium text-gray-700 mb-3">Detalles de la Entrega</h4>
            {submission ? (
              <div className="space-y-2 text-gray-700 mb-4">
                <p className="flex items-center">
                  <strong className="mr-2">Estado:</strong>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.grade !== null
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {submission.grade !== null ? `Calificado (${submission.grade})` : 'Pendiente'}
                  </span>
                </p>
                {submission.gitRepositoryUrl && (
                  <p className="flex items-center">
                    <strong className="mr-2">Repositorio Git:</strong>
                    <a
                      href={submission.gitRepositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      🔗 {submission.gitRepositoryUrl.split('/').slice(-2).join('/')}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No hay detalles de entrega disponibles.</p>
            )}

            <h4 className="text-xl font-medium text-gray-700 mb-3">Versiones Anteriores</h4>
            {versions.length === 0 ? (
              <div className="text-gray-600">No se encontraron versiones para esta entrega.</div>
            ) : (
              <ul className="space-y-3">
                {versions.map((v, index) => (
                  <li
                    key={v.id}
                    className={`p-4 border border-gray-200 rounded-md shadow-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-gray-800">Versión {v.versionNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(v.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {v.fileUrl ? (
                        <a
                          href={v.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center"
                        >
                          <FaFileArchive className="mr-1" /> Descargar ZIP
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">Sin archivo ZIP</span>
                      )}

                      {v.gitCommitHash && submission?.gitRepositoryUrl ? (
                        <a
                          href={`${submission.gitRepositoryUrl.replace(/\.git$/, '')}/commit/${v.gitCommitHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline text-sm flex items-center"
                        >
                          <FaGithub className="mr-1" /> Commit: {v.gitCommitHash.slice(0, 7)}
                        </a>
                      ) : (
                        v.gitCommitHash && (
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                            Commit: {v.gitCommitHash.slice(0, 7)}
                          </span>
                        )
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Column: Comments Section */}
          {submission?.id && (
            <div className="lg:w-1/2 mt-6 lg:mt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-6 pt-6 lg:pt-0">
              <h4 className="text-xl font-medium text-gray-700 mb-3">Comentarios del Profesor</h4>
              <SubmissionComments submissionId={submission.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
