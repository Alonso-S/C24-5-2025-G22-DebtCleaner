import { useEffect, useState } from 'react'
import { api } from '../../../core/api/apiClient'
import StudentTaskPanel from './StudentTaskPanel'

interface Project {
  id: number
  title: string
  description?: string
  dueDate?: string
}

interface Props {
  courseId: number
}

export const StudentCourseTasks = ({ courseId }: Props) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/projects/course/${courseId}`)
      setProjects(res.data || [])
    } catch (err) {
      console.error(err)
      setError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="bg-white/80 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Tareas del curso</h3>
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-gray-600">No hay tareas disponibles.</div>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">
                      {p.dueDate ? new Date(p.dueDate).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <button onClick={() => setSelected(p)} className="text-blue-600">
                    Abrir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        {selected ? (
          <StudentTaskPanel project={selected} />
        ) : (
          <div className="bg-white/80 p-6 rounded text-gray-600">
            Selecciona una tarea para ver detalles y entregar.
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentCourseTasks
