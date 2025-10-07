import { useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'

export const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio')
  const studentSections = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <HomeIcon />,
      component: (
        <>
          <div>Inicio</div>
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
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {studentSections.find((section) => section.id === activeSection)?.component}
        </div>
      </main>
    </DashboardLayout>
  )
}
