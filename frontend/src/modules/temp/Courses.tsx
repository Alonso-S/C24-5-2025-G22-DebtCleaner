import { useState } from 'react'
import { useAuth } from '../auth/hooks/useAuth'

const plusIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)
const Courses: React.FC = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')
  const [newCourseDesc, setNewCourseDesc] = useState('')

  const teacherView = user?.role === 'PROFESSOR'

  const handleCreateCourse = () => {
    // Simulated course creation
    setShowCreateModal(false)
    setNewCourseName('')
    setNewCourseDesc('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {teacherView ? 'Mis Cursos' : 'Cursos Inscritos'}
          </h1>
          <p className="text-muted-foreground">
            {teacherView
              ? 'Gestiona tus cursos y tareas asignadas'
              : 'Accede a tus cursos y completa las tareas asignadas'}
          </p>
        </div>

        {teacherView && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2"
          >
            {plusIcon}
            Crear Curso
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Crear Nuevo Curso</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="ej. Programación Avanzada"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripción
                </label>
                <textarea
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Describe el objetivo del curso..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCourse}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                Crear Curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Courses
