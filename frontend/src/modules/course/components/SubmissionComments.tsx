import React, { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import { useAuth } from '../../auth/hooks/useAuth'

type User = {
  id: number
  name: string
  email: string
  role?: string
}

type CommentDTO = {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  submissionId: number
  userId: number
  parentId?: number | null
  user?: User
  replies?: CommentDTO[]
}

interface Props {
  submissionId: number | null
}

const SubmissionComments: React.FC<Props> = ({ submissionId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState<CommentDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newContent, setNewContent] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [posting, setPosting] = useState(false)

  const fetchComments = async () => {
    if (!submissionId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/projects/comments/submission/${submissionId}`)
      setComments(res.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los comentarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId])

  const handlePost = async () => {
    if (!submissionId) return
    if (!user?.id) {
      setError('Usuario no autenticado')
      return
    }
    if (!newContent.trim()) {
      setError('El comentario está vacío')
      return
    }

    setPosting(true)
    setError(null)
    try {
      const payload = {
        content: newContent.trim(),
        submissionId,
        userId: user.id,
        parentId: replyTo ?? null,
      }
      await api.post('/projects/comments', payload)
      // backend devuelve data: comment
      setNewContent('')
      setReplyTo(null)
      // recargar lista
      await fetchComments()
    } catch (err) {
      console.error(err)
      setError('Error al enviar el comentario')
    } finally {
      setPosting(false)
    }
  }

  const handleReply = (commentId: number) => {
    setReplyTo(commentId)
    const el = document.getElementById('comment-input')
    if (el) el.focus()
  }

  const renderReplies = (replies?: CommentDTO[]) => {
    if (!replies || replies.length === 0) return null
    return (
      <div className="ml-4 border-l pl-3 mt-2 space-y-2">
        {replies.map((r) => (
          <div key={r.id} className="bg-gray-50 p-2 rounded">
            <div className="text-sm font-medium">{r.user?.name || r.userId}</div>
            <div className="text-sm text-gray-700">{r.content}</div>
            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-2">Comentarios</h4>
      {loading ? (
        <div>Cargando comentarios...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-sm text-gray-600">Aún no hay comentarios.</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium">{c.user?.name || c.userId}</div>
                    <div className="text-sm text-gray-700 mt-1">{c.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleReply(c.id)}
                      className="text-sm text-blue-600"
                      type="button"
                    >
                      Responder
                    </button>
                  </div>
                </div>
                {/* replies */}
                {renderReplies(c.replies)}
              </div>
            ))
          )}

          <div className="mt-3">
            {replyTo && (
              <div className="text-xs text-gray-600 mb-1">
                Respondiendo al comentario #{replyTo}{' '}
                <button onClick={() => setReplyTo(null)} className="text-red-600 ml-2">
                  Cancelar
                </button>
              </div>
            )}
            <textarea
              id="comment-input"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
            <div className="flex items-center justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setNewContent('')
                  setReplyTo(null)
                }}
                className="px-3 py-2 bg-gray-100 rounded"
              >
                Limpiar
              </button>
              <button
                onClick={handlePost}
                disabled={posting}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                {posting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubmissionComments
