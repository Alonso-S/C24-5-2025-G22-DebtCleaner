import React, { useEffect, useState, useCallback } from 'react'
import { api } from '../../../core/api/apiClient'
import { TaskCard } from '../../../shared/components/TaskCard'
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa'

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  createdAt: string
  status?: string
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
  const [showForm, setShowForm] = useState(false) // New state to control form visibility

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
    setShowForm(false) // Hide form after reset
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
    setShowForm(true) // Show form when editing
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
    <div className="p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Tareas del Curso</h3>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) resetForm() // Reset form if hiding
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> {showForm ? 'Cancelar' : 'Crear Tarea'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6 p-4 border rounded-lg shadow-sm bg-white"
        >
          <h4 className="text-xl font-medium mb-2">
            {editingId ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </h4>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Título de la tarea"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Descripción detallada de la tarea"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Fecha límite
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {submitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : editingId ? (
                'Actualizar Tarea'
              ) : (
                'Crear Tarea'
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center p-6 text-blue-600">
            <FaSpinner className="animate-spin text-3xl mr-2" />
            <p className="text-lg">Cargando tareas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            <p className="text-lg">No hay tareas disponibles para este curso.</p>
            <p className="text-sm">Haz clic en 'Crear Tarea' para añadir una nueva.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                footer={
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    >
                      <FaEdit className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                    >
                      <FaTrash className="mr-1" /> Eliminar
                    </button>
                  </div>
                }
              >
                {/* Additional task details can go here if needed */}
              </TaskCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseTasksSection
