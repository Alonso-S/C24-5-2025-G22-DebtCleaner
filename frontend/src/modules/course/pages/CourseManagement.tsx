import { useState } from 'react'
import { ArrowLeftIcon } from '../../../shared/components/icons/ArrowLeftIcon'
import { CourseStudentsSection } from '../components/CourseStudentsSection'
import CourseTasksSection from '../components/CourseTasksSection'
import TaskProfessorSection from './TaskProfessorSection'

interface CourseManagementProps {
  courseId: number
  onReturn: () => void
}

export const CourseManagement = ({ courseId, onReturn }: CourseManagementProps) => {
  const tabs = [
    // { id: 'general', label: 'Información General' },
    { id: 'tareas', label: 'Tareas', component: <CourseTasksSection courseId={courseId} /> },

    {
      id: 'estudiantes',
      label: 'Estudiantes',
      component: <CourseStudentsSection courseId={courseId} />,
    },
    { id: 'entregas', label: 'Entregas', component: <TaskProfessorSection courseId={courseId} /> },
  ]

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div
      className="animate-fade-in overflow-auto"
      style={{ scrollBehavior: 'smooth', height: '100%' }}
    >
      {/* Cabecera con botón de regreso */}
      <div className="flex items-center mb-2">
        <button
          onClick={onReturn}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Regresar a la lista de cursos"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-[rgb(18,24,38)]">Gestión del Curso</h2>
      </div>

      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-[rgb(0,178,227)] text-[rgb(0,178,227)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña seleccionada */}
      {tabs.find((tab) => tab.id === activeTab)?.component}
    </div>
  )
}
