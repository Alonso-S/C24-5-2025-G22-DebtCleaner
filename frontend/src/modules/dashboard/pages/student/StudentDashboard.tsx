import { lazy, useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import { BookOpenIcon } from '../../../../shared/components/icons/BookOpenIcon'
import { PlusCircleIcon } from '../../../../shared/components/icons/PlusCircleIcon'
import { useAuth } from '../../../auth/hooks/useAuth'
import { Configuration } from './Configuration'

// Lazy load tab components for better performance
const HomeTab = lazy(() => import('../../components/student/HomeTab'))
const CoursesTab = lazy(() => import('../../components/student/CoursesTab'))
const JoinCourseTab = lazy(() => import('../../components/student/JoinCourseTab'))

export const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')

  // Define sidebar sections
  const studentSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
      component: <HomeTab userName={user?.name} />,
    },
    {
      id: 'cursos',
      label: 'Mis Cursos',
      icon: <BookOpenIcon />,
      component: <CoursesTab />,
    },
    {
      id: 'unirse-curso',
      label: 'Unirse a un Curso',
      icon: <PlusCircleIcon />,
      component: <JoinCourseTab />,
    },
    {
      id: 'analizar',
      label: 'Analizar Proyecto',
      icon: <BookOpenIcon />,
      // component: <AnalyzeProject />,
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: <BookOpenIcon />,
      component: (
        <>
          <Configuration />
        </>
      ),
    },
  ]

  return (
    <DashboardLayout
      sections={studentSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {studentSections.find((section) => section.id === activeSection)?.component}
    </DashboardLayout>
  )
}
