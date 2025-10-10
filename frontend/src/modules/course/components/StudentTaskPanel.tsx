import { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import { useAuth } from '../../auth/hooks/useAuth'
import SubmissionComments from './SubmissionComments'
import SubmissionForm from './SubmissionForm'
import SubmissionHistory from './SubmissionHistory'

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

interface StudentTaskPanelProps {
  project: Project
}

// Max file size in bytes (20 MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024

interface Submission {
  id: number
  reviewStatus?: string
  status?: string
  grade?: number | null
  gitRepositoryUrl?: string | null
  content?: string | null
}

export const StudentTaskPanel = ({ project }: StudentTaskPanelProps) => {
  const { user } = useAuth()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [versions, setVersions] = useState<SubmissionVersion[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [gitUrl, setGitUrl] = useState<string>('')
  const [linking, setLinking] = useState(false)
  const [commits, setCommits] = useState<{ sha: string; message?: string; date?: string }[]>([])
  const [loadingCommits, setLoadingCommits] = useState(false)
  const [selectedSha, setSelectedSha] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'submission' | 'history' | 'comments'>('submission');
  const [gitLinkSuccess, setGitLinkSuccess] = useState<boolean | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  const fetchSubmission = async () => {
    setLoading(true)
    setError(null)
    try {
      // endpoint to get student's submission: /api/projects/{projectId}/submissions/{userId}
      const res = await api.get(`/projects/${project.id}/submissions/${user?.id}`)
      console.log('Fetched submission:', res.data)
      setSubmission(res.data || null)
      if (res.data && res.data.id) {
        const v = await api.get(`/projects/submissions/${res.data.id}/versions`)
        setVersions(v.data || [])
      } else {
        setVersions([])
      }
    } catch (err: unknown) {
      // If 404 or no submission, clear
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, user?.id])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(null)
    const files = e.target.files
    if (!files || files.length === 0) return
    const f = files[0]
    if (!f.name.toLowerCase().endsWith('.zip')) {
      setError('Solo se permiten archivos .zip')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('El archivo excede el tamaño máximo de 20 MB')
      return
    }
    setSelectedFile(f)
  }

  const validateGitUrl = (url: string) => {
    if (!url) return 'La URL del repositorio es requerida'
    // simple github url check (https://github.com/user/repo)
    const githubPattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/i
    if (!githubPattern.test(url))
      return 'Introduce una URL válida de GitHub (https://github.com/usuario/repositorio)'
    return null
  }

  const handleLinkGit = async (url: string) => {
    setGitLinkSuccess(null);
    setError(null)
    setSuccess(null)
    setGitUrl(url);
    const validation = validateGitUrl(url.trim())
    if (validation) {
      setError(validation)
      setGitLinkSuccess(false);
      return
    }
    if (!user?.id) {
      setError('Usuario no autenticado')
      setGitLinkSuccess(false);
      return
    }

    try {
      setLinking(true)
      // backend expects projectId, userId, gitRepositoryUrl and optional gitCommitHash in body
      type GitPayload = {
        projectId: number
        userId: number
        gitRepositoryUrl: string
        gitCommitHash?: string | null
      }
      const payload: GitPayload = {
        projectId: project.id,
        userId: Number(user.id),
        gitRepositoryUrl: url.trim(),
      }
      if (selectedSha) payload.gitCommitHash = selectedSha
      await api.post('/projects/submissions/git', payload)
      setSuccess('Repositorio vinculado correctamente')
      setGitLinkSuccess(true);
      setGitUrl('')
      // refresh submission to show linked repo
      await fetchSubmission()
    } catch (e: unknown) {
      console.error(e)
      let message: string | null = null
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const maybe = e as { response?: { data?: { message?: string } } }
        message = maybe.response?.data?.message ?? null
      }
      setError(message || 'Error al vincular el repositorio')
      setGitLinkSuccess(false);
    } finally {
      setLinking(false)
    }
  }

  const fetchCommits = async () => {
    setLoadingCommits(true)
    setCommits([])
    setError(null)
    try {
      // backend endpoint expects repo query like owner/repo
      // extract owner/repo from gitUrl
      const match = gitUrl.match(/github\.com\/(.+\/.+)/i)
      if (!match) {
        setError('Introduce una URL válida de GitHub para listar commits')
        return
      }
      const repo = match[1].replace(/\/$/, '')
      const res = await api.get(`/github/commits?repo=${encodeURIComponent(repo)}`)
      setCommits(res.data?.data || [])
    } catch (err) {
      console.error(err)
      setError(
        'No se pudieron obtener los commits. Asegúrate de haber conectado tu cuenta de GitHub.'
      )
    } finally {
      setLoadingCommits(false)
    }
  }

  const handleUpload = async (file: File) => {
    setUploadSuccess(null);
    setError(null)
    setSuccess(null)
    if (!file) {
      setError('Selecciona un archivo .zip')
      setUploadSuccess(false);
      return
    }
    if (!user?.id) {
      setError('Usuario no autenticado')
      setUploadSuccess(false);
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    // validator expects projectId and userId in body
    formData.append('projectId', String(project.id))
    formData.append('userId', String(user.id))

    try {
      setUploading(true)
      await api.post('/projects/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess('Archivo subido correctamente')
      setUploadSuccess(true);
      setSelectedFile(null)
      // refresh
      await fetchSubmission()
    } catch (err) {
      console.error(err)
      setError('Error al subir el archivo')
      setUploadSuccess(false);
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white/80 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Fecha límite: {project.dueDate ? new Date(project.dueDate).toLocaleString() : 'N/A'}
      </p>

      <div className="mb-4 border-t pt-4">
        <h4 className="font-medium mb-2">Entrega</h4>
        {loading ? (
          <div>Cargando entrega...</div>
        ) : submission ? (
          <div className="mb-2">
            <p className="text-sm text-gray-700">
              Estado: {submission.reviewStatus || submission.status || 'N/A'}
            </p>
            <p className="text-sm text-gray-700">
              Calificación:{' '}
              {submission.grade !== null && submission.grade !== undefined
                ? `${submission.grade}`
                : 'Sin calificar'}
            </p>
          </div>
        ) : (
          <div className="mb-2 text-sm text-gray-600">Aún no has entregado esta tarea.</div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('submission')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'submission'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Entrega
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Historial
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Comentarios
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'submission' && (
            <SubmissionForm
              onFileUpload={handleUpload}
              onGitLink={handleLinkGit}
              isUploading={uploading}
              isLinkingGit={linking}
              gitLinkSuccess={gitLinkSuccess}
              uploadSuccess={uploadSuccess}
            />
          )}
          {activeTab === 'history' && (
            <SubmissionHistory
              versions={versions}
              submissionGitRepositoryUrl={submission?.gitRepositoryUrl}
            />
          )}
          {activeTab === 'comments' && submission?.id && (
            <SubmissionComments submissionId={submission.id} />
          )}
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mb-2">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentTaskPanel;
