import React, { useState } from 'react'
import type { Student, SubmissionSummary } from '../../../shared/types'

interface Project {
  id: number
  title: string
  description?: string
  dueDate?: string
}

interface ProjectSubmissionsViewProps {
  project: Project
  submissions: SubmissionSummary[]
  students: Student[]
  loadingSubmissions: boolean
  errorSubmissions: string | null
  fetchSubmissions: (projectId: number) => Promise<void>
  onBack: () => void
  onViewHistory: (submissionId: number, student: Student) => Promise<void>
}

export const ProjectSubmissionsView: React.FC<ProjectSubmissionsViewProps> = ({
  project,
  submissions,
  students,
  loadingSubmissions,
  errorSubmissions,
  fetchSubmissions,
  onBack,
  onViewHistory,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  if (!project) return null

  // const submissions = submissionsByProject[project.id] || []

  const submittedStudents = students.filter((student) =>
    submissions.some((submission) => submission.userId === student.id)
  )
  const unsubmittedStudents = students.filter(
    (student) => !submissions.some((submission) => submission.userId === student.id)
  )

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-3 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
          title="Volver a la lista de proyectos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-4xl font-extrabold text-gray-900">{project.title}</h3>
            <p className="text-lg text-gray-500">
              Fecha límite:{' '}
              <span className="font-semibold text-indigo-600">
                {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
              </span>
            </p>
          </div>
          {project.description && (
            <p className="text-gray-700 mt-1 text-lg">{project.description}</p>
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Student List */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes</h4>
          <ul className="space-y-2">
            {students.map((student) => {
              const hasSubmitted = submissions.some(
                (submission) => submission.userId === student.id
              )
              const isSelected = selectedStudentId === student.id

              return (
                <li
                  key={student.id}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800 font-bold'
                        : hasSubmitted
                          ? 'bg-white hover:bg-gray-100 text-gray-700'
                          : 'bg-gray-200 text-gray-500 italic'
                    }
                  `}
                  onClick={() => setSelectedStudentId(student.id)}
                >
                  {student.name}
                  {!hasSubmitted && <span className="ml-2 text-sm">(No entregado)</span>}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right Column: Submission Details */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {selectedStudentId ? (
            (() => {
              const selectedStudent = students.find((s) => s.id === selectedStudentId)
              console.log(submissions)
              const studentSubmission = submissions.find((s) => s.userId === selectedStudentId)

              return (
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Detalles de la Entrega</h4>
                  {/* Student Info */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-md">
                    <p className="text-lg font-semibold text-blue-800">
                      Estudiante: {students.find((s) => s.id === selectedStudentId)?.name}
                    </p>
                    <p className="text-sm text-blue-700">ID: {selectedStudentId}</p>
                  </div>

                  {studentSubmission ? (
                    <div className="space-y-6">
                      {/* Technical Debt Analysis */}
                      <div>
                        <h5 className="text-xl font-semibold text-gray-700 mb-2">
                          Análisis de Deuda Técnica
                        </h5>
                        <div className="p-4 bg-gray-100 rounded-md text-gray-700">
                          <p>
                            {studentSubmission.technicalDebtAnalysis ||
                              'No hay análisis de deuda técnica disponible.'}
                          </p>
                        </div>
                      </div>

                      {/* Refactoring Recommendations */}
                      <div>
                        <h5 className="text-xl font-semibold text-gray-700 mb-2">
                          Recomendaciones de Refactorización
                        </h5>
                        <div className="p-4 bg-gray-100 rounded-md text-gray-700">
                          <p>
                            {studentSubmission.refactoringRecommendations ||
                              'No hay recomendaciones de refactorización disponibles.'}
                          </p>
                        </div>
                      </div>

                      {/* Comments and Grading */}
                      <div>
                        <h5 className="text-xl font-semibold text-gray-700 mb-2">
                          Comentarios y Calificación
                        </h5>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          rows={5}
                          placeholder="Escribe tus comentarios y la calificación aquí..."
                          defaultValue={studentSubmission.comments || ''}
                        ></textarea>
                      </div>

                      {/* Save Grade Button */}
                      <div className="text-right">
                        <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors">
                          Guardar Calificación
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-md text-yellow-800">
                      <p className="font-semibold">
                        Este estudiante no ha realizado ninguna entrega para este proyecto.
                      </p>
                    </div>
                  )}
                </div>
              )
            })()
          ) : (
            <p className="text-gray-500 text-center py-10">
              Selecciona un estudiante para ver los detalles de su entrega.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectSubmissionsView
