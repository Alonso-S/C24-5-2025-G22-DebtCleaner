import { useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import { PlusCircleIcon } from '../../../../shared/components/icons/PlusCircleIcon'
import { CreateCourseForm } from '../../../course/components/CreateCourseForm'
import { BookOpenIcon } from '../../../../shared/components/icons/BookOpenIcon'
import { CourseList } from '../../../course/components/CourseList'
import HomeSection from '../../components/professor/HomeSection'

export const ProfessorDashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio')
  const professorSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
      component: <HomeSection setActiveSection={setActiveSection} />,
    },
    {
      id: 'cursos',
      label: 'Mis Cursos',
      icon: <BookOpenIcon />,
      component: <CourseList />,
    },
    {
      id: 'crear-curso',
      label: 'Crear Curso',
      icon: <PlusCircleIcon />,
      component: <CreateCourseForm />,
    },
  ]
  return (
    <DashboardLayout
      sections={professorSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <main className="flex-1 overflow-y-auto bg-gray-50 ">
        <div className="mx-auto max-w-7xl h-full">
          {professorSections.find((section) => section.id === activeSection)?.component}
        </div>
      </main>
    </DashboardLayout>
  )
}
