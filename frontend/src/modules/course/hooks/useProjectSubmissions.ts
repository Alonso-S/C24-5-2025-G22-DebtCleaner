import { useState, useEffect } from 'react'
import { api } from '../../../core/api/apiClient'
import { useAuth } from '../../auth/hooks/useAuth'

export interface Project {
  id: number
  title: string
  description?: string
  dueDate?: string
}

export interface SubmissionVersion {
  id: number
  versionNumber: number
  fileUrl?: string
  gitCommitHash?: string | null
  createdAt: string
}

export interface Submission {
  id: number
  userId: number
  projectId: number
  reviewStatus?: string
  status?: string
  grade?: number | null
  gitRepositoryUrl?: string | null
  content?: string | null
  createdAt: string
  fileUrl?: string | null
  versions?: SubmissionVersion[]
}

export const useProjectSubmissions = (projectId?: number, userId?: number) => {
  const { user } = useAuth()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [versions, setVersions] = useState<SubmissionVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUserId = userId || user?.id

  const fetchSubmission = async () => {
    if (!projectId || !currentUserId) return

    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/projects/${projectId}/submissions/${currentUserId}`)
      setSubmission(res.data || null)

      if (res.data && res.data.id) {
        const versionsRes = await api.get(`/projects/submissions/${res.data.id}/versions`)
        setVersions(versionsRes.data || [])
      } else {
        setVersions([])
      }
    } catch (err: unknown) {
      // Si es 404 o no hay entrega, limpiar
      const status = (() => {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const maybe = err as { response?: { status?: number } }
          return maybe.response?.status ?? null
        }
        return null
      })()

      if (status === 404) {
        setSubmission(null)
        setVersions([])
      } else {
        console.error(err)
        setError('Error al cargar la entrega')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmission()
  }, [projectId, currentUserId])

  return {
    submission,
    versions,
    loading,
    error,
    refreshSubmission: fetchSubmission,
  }
}

export default useProjectSubmissions
