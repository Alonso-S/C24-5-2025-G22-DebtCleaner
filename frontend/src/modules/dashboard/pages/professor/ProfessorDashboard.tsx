import { Suspense, useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import { PlusCircleIcon } from '../../../../shared/components/icons/PlusCircleIcon'
import { BookOpenIcon } from '../../../../shared/components/icons/BookOpenIcon'
import { Skeleton } from '../../../../shared/components/ui'
import { useAuth } from '../../../auth/hooks/useAuth'
import HomeSection from '../../components/professor/HomeSection'
import CoursesTab from '../../components/professor/CoursesTab'
import CreateCourseTab from '../../components/professor/CreateCourseTab'

export const ProfessorDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')

  const professorSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
      component: <HomeSection userName={user?.name ?? ''} setActiveSection={setActiveSection} />,
    },
    {
      id: 'cursos',
      label: 'Mis Cursos',
      icon: <BookOpenIcon />,
      component: <CoursesTab />,
    },
    {
      id: 'crear-curso',
      label: 'Crear Curso',
      icon: <PlusCircleIcon />,
      component: <CreateCourseTab />,
    },
  ]

  return (
    <DashboardLayout
      sections={professorSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <Suspense fallback={<Skeleton />}>
        {professorSections.find((section) => section.id === activeSection)?.component}
      </Suspense>
    </DashboardLayout>
  )
}
