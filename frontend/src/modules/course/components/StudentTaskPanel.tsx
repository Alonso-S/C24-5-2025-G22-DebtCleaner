import { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import { useAuth } from '../../auth/hooks/useAuth'
import SubmissionComments from './SubmissionComments'

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

  const handleLinkGit = async () => {
    setError(null)
    setSuccess(null)
    const validation = validateGitUrl(gitUrl.trim())
    if (validation) {
      setError(validation)
      return
    }
    if (!user?.id) {
      setError('Usuario no autenticado')
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
        gitRepositoryUrl: gitUrl.trim(),
      }
      if (selectedSha) payload.gitCommitHash = selectedSha
      await api.post('/projects/submissions/git', payload)
      setSuccess('Repositorio vinculado correctamente')
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

  const handleUpload = async () => {
    setError(null)
    setSuccess(null)
    if (!selectedFile) {
      setError('Selecciona un archivo .zip')
      return
    }
    if (!user?.id) {
      setError('Usuario no autenticado')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    // validator expects projectId and userId in body
    formData.append('projectId', String(project.id))
    formData.append('userId', String(user.id))

    try {
      setUploading(true)
      await api.post('/projects/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess('Archivo subido correctamente')
      setSelectedFile(null)
      // refresh
      await fetchSubmission()
    } catch (err) {
      console.error(err)
      setError('Error al subir el archivo')
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

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Archivo ZIP</label>
          <input type="file" accept=".zip" onChange={onFileChange} className="mt-1" />
          {selectedFile && (
            <p className="text-sm text-gray-600">Seleccionado: {selectedFile.name}</p>
          )}
        </div>
        <div className="mb-3 border-t pt-4">
          <h5 className="font-medium mb-2">Vincular repositorio Git</h5>
          <p className="text-sm text-gray-600 mb-2">
            Puedes vincular tu repositorio de GitHub como entrega alternativa.
          </p>
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="https://github.com/usuario/repositorio"
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <div className="flex space-x-2">
              <button
                onClick={fetchCommits}
                className="px-3 py-2 bg-gray-200 rounded"
                type="button"
              >
                {loadingCommits ? 'Cargando...' : 'Listar commits'}
              </button>
              <button
                onClick={handleLinkGit}
                disabled={linking}
                className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                type="button"
              >
                {linking ? 'Vinculando...' : 'Vincular'}
              </button>
            </div>
          </div>

          {commits.length > 0 && (
            <div className="mt-3">
              <label className="block text-sm">Seleccionar commit</label>
              <select
                value={selectedSha ?? ''}
                onChange={(e) => setSelectedSha(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="">-- Último commit --</option>
                {commits.map((c) => (
                  <option key={c.sha} value={c.sha}>
                    {c.sha.slice(0, 7)} - {c.message}
                  </option>
                ))}
              </select>
            </div>
          )}

          {submission?.gitRepositoryUrl && (
            <div className="mt-2 text-sm">
              Repositorio vinculado:{' '}
              <a
                href={submission.gitRepositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                {submission.gitRepositoryUrl}
              </a>
            </div>
          )}
          {/* Comentarios / hilo de discusión */}
          {submission?.id && <SubmissionComments submissionId={submission.id} />}
        </div>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-2">{success}</p>}
        <div className="flex space-x-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : 'Subir ZIP'}
          </button>
          <button
            onClick={() => {
              setSelectedFile(null)
              setError(null)
              setSuccess(null)
            }}
            className="px-3 py-2 bg-gray-100 rounded"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Historial de entregas</h4>
        {versions.length === 0 ? (
          <div className="text-sm text-gray-600">No hay entregas previas.</div>
        ) : (
          <ul className="space-y-2">
            {versions.map((v) => (
              <li
                key={v.id}
                className="flex justify-between items-center p-2 bg-white rounded border"
              >
                <div>
                  <div className="font-medium">Versión {v.versionNumber}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(v.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {v.fileUrl ? (
                    <a
                      href={v.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Descargar
                    </a>
                  ) : null}

                  {v.gitCommitHash ? (
                    submission?.gitRepositoryUrl ? (
                      <a
                        href={`${submission.gitRepositoryUrl.replace(/\.git$/, '')}/commit/${v.gitCommitHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm"
                      >
                        Commit {v.gitCommitHash.slice(0, 7)}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-700">
                        Commit {v.gitCommitHash.slice(0, 7)}
                      </div>
                    )
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default StudentTaskPanel
