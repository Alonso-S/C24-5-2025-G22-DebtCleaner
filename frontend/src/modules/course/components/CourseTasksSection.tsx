import { useEffect, useState, useCallback } from 'react'
import { api } from '../../../core/api/apiClient'

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  createdAt: string
}

interface Props {
  courseId: number
}

export const CourseTasksSection = ({ courseId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/projects/course/${courseId}`)
      setTasks(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const validateDueDate = (d: string) => {
    if (!d) return 'La fecha límite es requerida'
    const selected = new Date(d)
    const now = new Date()
    if (selected <= now) return 'La fecha límite debe ser posterior a la fecha actual'
    return null
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setEditingId(null)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError('El título es requerido')
      return
    }
    const dateError = validateDueDate(dueDate)
    if (dateError) {
      setError(dateError)
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        const res = await api.put(`/projects/${editingId}`, {
          title: title.trim(),
          description: description.trim(),
          dueDate,
        })
        setTasks((prev) => prev.map((t) => (t.id === editingId ? res.data : t)))
        setSuccess('Tarea actualizada correctamente')
      } else {
        const res = await api.post('/projects', {
          title: title.trim(),
          description: description.trim(),
          courseId,
          dueDate,
        })
        setTasks((prev) => [res.data, ...prev])
        setSuccess('Tarea creada correctamente')
      }
      resetForm()
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al guardar la tarea')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setDueDate(task.dueDate.slice(0, 16)) // para input datetime-local
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await api.delete(`/projects/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
      setError('No se pudo eliminar la tarea')
    }
  }

  return (
    <div className="bg-white/80 p-6 rounded-lg shadow-sm backdrop-blur-sm">
      <h3 className="text-lg font-medium mb-4">Gestión de Tareas</h3>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha límite</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {editingId
              ? submitting
                ? 'Actualizando...'
                : 'Actualizar tarea'
              : submitting
                ? 'Creando...'
                : 'Crear tarea'}
          </button>
        </div>
      </form>

      <div>
        {loading ? (
          <div>Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div>No hay tareas aún.</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 bg-white rounded shadow-sm border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500">
                      Límite: {new Date(task.dueDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-2 py-1 text-sm bg-yellow-100 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-2 py-1 text-sm bg-red-100 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CourseTasksSection
