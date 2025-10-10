import { lazy, useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import { BookOpenIcon } from '../../../../shared/components/icons/BookOpenIcon'
import { PlusCircleIcon } from '../../../../shared/components/icons/PlusCircleIcon'
import useTabs from '../../../../shared/hooks/useTabs'
import { useAuth } from '../../../auth/hooks/useAuth'

// Lazy load tab components for better performance
const HomeTab = lazy(() => import('../../components/student/HomeTab'))
const CoursesTab = lazy(() => import('../../components/student/CoursesTab'))
const JoinCourseTab = lazy(() => import('../../components/student/JoinCourseTab'))

export const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')
  const { activeTab, setActiveTab } = useTabs('home')
  
  // Define sidebar sections
  const studentSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
    },
    {
      id: 'cursos',
      label: 'Mis Cursos',
      icon: <BookOpenIcon />,
    },
    {
      id: 'unirse-curso',
      label: 'Unirse a un Curso',
      icon: <PlusCircleIcon />,
    },
  ]
  
  // Define tabs for the dashboard
  const dashboardTabs = [
    {
      id: 'home',
      label: 'Resumen',
      component: <HomeTab userName={user?.name} />,
    },
    {
      id: 'courses',
      label: 'Mis Cursos',
      component: <CoursesTab />,
    },
    {
      id: 'join',
      label: 'Unirse a un Curso',
      component: <JoinCourseTab />,
    },
  ]

  return (
    <DashboardLayout
      sections={studentSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      tabs={dashboardTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  )
}
