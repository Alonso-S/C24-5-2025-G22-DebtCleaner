import { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import { courseService } from '../services/courseService'
import type { Student } from '../../../shared/types'

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

export const useTaskProfessorData = (courseId: number) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [submissionsByProject, setSubmissionsByProject] = useState<
    Record<number, SubmissionSummary[]>
  >({})
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedSubmissionForModal, setSelectedSubmissionForModal] = useState<{
    submissionId: number
    student: Student
  } | null>(null)
  const [selectedSubmissionDetails, setSelectedSubmissionDetails] =
    useState<SubmissionSummary | null>(null)
  const [versions, setVersions] = useState<SubmissionVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [errorSubmissions, setErrorSubmissions] = useState<string | null>(null)

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
    setLoadingSubmissions(true)
    setErrorSubmissions(null)
    try {
      const res = await api.get(`/projects/${projectId}/submissions`)
      const arr: SubmissionSummary[] = res.data || []
      setSubmissionsByProject((prev) => ({ ...prev, [projectId]: arr }))
    } catch {
      console.warn('No submissions endpoint or none for project', projectId)
      setSubmissionsByProject((prev) => ({ ...prev, [projectId]: [] }))
      setErrorSubmissions('No se pudieron cargar las entregas para este proyecto.')
    } finally {
      setLoadingSubmissions(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  useEffect(() => {
    if (selectedProject && !submissionsByProject[selectedProject.id]) {
      fetchSubmissionsForProject(selectedProject.id)
    }
  }, [selectedProject, submissionsByProject])

  const openVersionsModal = async (submissionId: number, student: Student) => {
    setSelectedSubmissionForModal({ submissionId, student })
    setVersions([])
    setSelectedSubmissionDetails(null)
    try {
      const [resV, resS] = await Promise.all([
        api.get(`/projects/submissions/${submissionId}/versions`),
        api.get(`/projects/submissions/${submissionId}`),
      ])
      setVersions(resV.data || [])
      setSelectedSubmissionDetails(resS.data || null)
    } catch (err) {
      console.error(err)
      setError('No se pudo cargar el historial de versiones')
    }
  }

  const closeVersionsModal = () => {
    setSelectedSubmissionForModal(null)
    setVersions([])
    setSelectedSubmissionDetails(null)
  }

  return {
    projects,
    students,
    submissionsByProject,
    selectedProject,
    setSelectedProject,
    selectedSubmissionForModal,
    selectedSubmissionDetails,
    versions,
    loading,
    error,
    loadingSubmissions,
    errorSubmissions,
    fetchSubmissionsForProject,
    openVersionsModal,
    closeVersionsModal,
  }
}