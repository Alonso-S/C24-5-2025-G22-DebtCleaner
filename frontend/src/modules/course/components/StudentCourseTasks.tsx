import { useEffect, useState, Suspense } from 'react'
import { api } from '../../../core/api/apiClient'
import StudentTaskPanel from './StudentTaskPanel'
import type { Project } from '../hooks/useProjectSubmissions'
import { Card, EmptyState, Skeleton } from '../../../shared/components/ui'
import ClipboardListIcon from '../../../shared/components/icons/ClipboardListIcon'
import { TaskCard } from '../../../shared/components/TaskCard' // Import TaskCard

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

  const renderProjectList = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm"
          >
            Reintentar
          </button>
        </div>
      )
    }

    if (projects.length === 0) {
      return (
        <EmptyState
          icon={<ClipboardListIcon className="w-12 h-12 text-gray-400" />}
          title="No hay tareas disponibles"
          description="Aún no se han asignado tareas para este curso."
        />
      )
    }

    return (
      <div className="space-y-2">
        {projects.map((p) => (
          <TaskCard
            key={p.id}
            className={`cursor-pointer ${selected?.id === p.id ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelected(p)}
            header={
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-base">{p.title}</h4>
                <span className="text-sm text-gray-500">
                  {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'Sin fecha límite'}
                </span>
              </div>
            }
            footer={
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(p)
                }}
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
              >
                Ver detalles
              </button>
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tareas del curso</h3>
            <button
              onClick={fetchProjects}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Actualizar tareas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          {renderProjectList()}
        </Card>
      </div>

      <div className="md:col-span-2">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
          {selected ? (
            <StudentTaskPanel project={selected} />
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 h-full">
              <ClipboardListIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Selecciona una tarea</h3>
              <p className="text-gray-500 text-center">
                Elige una tarea de la lista para ver sus detalles y realizar entregas.
              </p>
            </Card>
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default StudentCourseTasks
