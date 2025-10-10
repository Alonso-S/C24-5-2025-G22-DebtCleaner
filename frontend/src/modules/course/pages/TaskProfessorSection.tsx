import { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import { courseService } from '../services/courseService'
import type { Student } from '../../../shared/types'
import SubmissionComments from '../../course/components/SubmissionComments'

interface Project {
  id: number
  title: string
  description?: string
  dueDate?: string
}

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

interface Props {
  courseId: number
}

export const TaskProfessorSection = ({ courseId }: Props) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [submissionsByProject, setSubmissionsByProject] = useState<
    Record<number, SubmissionSummary[]>
  >({})
  const [selected, setSelected] = useState<{ submissionId: number; student: Student } | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionSummary | null>(null)
  const [versions, setVersions] = useState<SubmissionVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/projects/course/${courseId}`)
      setProjects(res.data || [])
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las tareas del curso')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const data = await courseService.getStudentsByCourse(courseId)
      setStudents(data || [])
    } catch (err) {
      console.error(err)
      // Non-fatal: instructor may not have students yet
    }
  }

  const fetchSubmissionsForProject = async (projectId: number) => {
    try {
      const res = await api.get(`/projects/${projectId}/submissions`)
      const arr: SubmissionSummary[] = res.data || []
      setSubmissionsByProject((prev) => ({ ...prev, [projectId]: arr }))
    } catch {
      // If endpoint not available or empty, set empty array to avoid repeated calls
      console.warn('No submissions endpoint or none for project', projectId)
      setSubmissionsByProject((prev) => ({ ...prev, [projectId]: [] }))
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  useEffect(() => {
    // prefetch submissions for listed projects
    projects.forEach((p) => {
      if (!submissionsByProject[p.id]) fetchSubmissionsForProject(p.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  const openVersions = async (submissionId: number, student: Student) => {
    setSelected({ submissionId, student })
    setVersions([])
    try {
      const [resV, resS] = await Promise.all([
        api.get(`/projects/submissions/${submissionId}/versions`),
        api.get(`/projects/submissions/${submissionId}`),
      ])
      setVersions(resV.data || [])
      setSelectedSubmission(resS.data || null)
    } catch (err) {
      console.error(err)
      setError('No se pudo cargar el historial de versiones')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gestión de Tareas (Profesor)</h2>

      {loading && <div>Cargando tareas...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white/80 p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-xs text-gray-500">
                  Fecha límite: {p.dueDate ? new Date(p.dueDate).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Entregas por estudiante</h4>
              <div className="space-y-2">
                {students.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    No hay estudiantes registrados para este curso.
                  </div>
                ) : (
                  students.map((s) => {
                    const subs = submissionsByProject[p.id] || []
                    const sub = subs.find((x) => String(x.userId) === String(s.id))
                    return (
                      <div
                        key={s.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm">
                            {sub ? (
                              <span className="text-green-600">Entregado</span>
                            ) : (
                              <span className="text-gray-500">No entregado</span>
                            )}
                          </div>
                          {/* badges: if submission has file and/or git info, show small badges */}
                          {sub?.fileUrl && (
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">ZIP</div>
                          )}
                          {sub?.gitRepositoryUrl && (
                            // show short commit from latest version if available
                            <div className="text-xs bg-indigo-100 px-2 py-1 rounded">
                              Repo
                              {sub.versions &&
                              sub.versions.length > 0 &&
                              sub.versions[0].gitCommitHash
                                ? ` ${sub.versions[0].gitCommitHash.slice(0, 7)}`
                                : ''}
                            </div>
                          )}
                          {sub && (
                            <button
                              onClick={() => openVersions(sub.id, s)}
                              className="text-blue-600 text-sm"
                            >
                              Ver historial
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Historial de entregas - {selected.student.name}
              </h3>
              <button
                onClick={() => {
                  setSelected(null)
                  setVersions([])
                }}
                className="text-gray-600"
              >
                Cerrar
              </button>
            </div>

            {versions.length === 0 ? (
              <div className="text-sm text-gray-600">
                No se encontraron versiones para esta entrega.
              </div>
            ) : (
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li key={v.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">Versión {v.versionNumber}</div>
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
                          className="text-blue-600"
                        >
                          Descargar
                        </a>
                      ) : (
                        <div className="text-xs text-gray-400">Sin archivo</div>
                      )}

                      {v.gitCommitHash && selected && (
                        <>
                          {selectedSubmission?.gitRepositoryUrl ? (
                            <a
                              href={`${selectedSubmission.gitRepositoryUrl.replace(/\.git$/, '')}/commit/${v.gitCommitHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 text-xs"
                            >
                              Commit: {v.gitCommitHash.slice(0, 7)}
                            </a>
                          ) : (
                            <div className="text-xs text-indigo-600">
                              Commit: {v.gitCommitHash.slice(0, 7)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Chat / Comentarios (profesor + estudiante) */}
            {/* Pass the submission id so the professor can post/read comments */}
            {selected && (
              <div className="mt-4">
                <SubmissionComments submissionId={selected.submissionId} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskProfessorSection
