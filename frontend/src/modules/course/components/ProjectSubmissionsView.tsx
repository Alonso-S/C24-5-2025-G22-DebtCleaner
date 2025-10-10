import React from 'react'
import { EmptyState, Skeleton } from '../../../shared/components/ui'
import ClipboardListIcon from '../../../shared/components/icons/ClipboardListIcon'
import type { Student, SubmissionSummary } from '../../../shared/types'
import { StudentSubmissionRow } from '../components/StudentSubmissionRow'

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
        <div>
          <h3 className="text-3xl font-bold text-gray-800">{project.title}</h3>
          {project.description && <p className="text-gray-600 mt-1">{project.description}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Fecha límite: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <h4 className="text-2xl font-semibold text-gray-700 mb-4">Entregas de Estudiantes</h4>
      {loadingSubmissions ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : errorSubmissions ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{errorSubmissions}</p>
          <button
            onClick={() => fetchSubmissions(project.id)}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<ClipboardListIcon className="w-10 h-10 text-gray-400" />}
          title="No hay estudiantes"
          description="No hay estudiantes registrados en este curso para esta tarea."
        />
      ) : (
        <div className="space-y-6">
          {submittedStudents.length > 0 && (
            <div>
              <h5 className="text-lg font-semibold text-gray-700 mb-3">
                Entregados ({submittedStudents.length})
              </h5>
              <div className="space-y-3">
                {submittedStudents.map((student) => {
                  const submission = submissions.find((s) => s.userId === student.id)
                  return (
                    <StudentSubmissionRow
                      key={student.id}
                      student={student}
                      submission={submission}
                      onViewHistory={submission ? onViewHistory : undefined}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {unsubmittedStudents.length > 0 && (
            <div>
              <h5 className="text-lg font-semibold text-gray-700 mb-3">
                No Entregados ({unsubmittedStudents.length})
              </h5>
              <div className="space-y-3">
                {unsubmittedStudents.map((student) => (
                  <StudentSubmissionRow
                    key={student.id}
                    student={student}
                    onViewHistory={undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
