import { useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import JoinCourse from '../../components/JoinCourse'

const Inicio = () => (
  <div className="space-y-6">
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold">Bienvenido</h2>
      <p className="text-sm text-gray-700">Aquí verás tus clases y tareas.</p>
    </div>
  </div>
)

export const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio')
  const studentSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
      component: <Inicio />,
    },
    {
      id: 'unirse-clase',
      label: 'Unirse a Clase',
      icon: <HomeIcon />,
      component: <JoinCourse />,
    },
  ]

  return (
    <DashboardLayout
      sections={studentSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {studentSections.find((section) => section.id === activeSection)?.component}
        </div>
      </main>
    </DashboardLayout>
  )
}
