import { useState } from 'react'
import { UserRoleManagement } from '../../components/UserRoleManagement'
import { UsersIcon } from '../../../../shared/components/icons/UsersIcon'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'

export const AdminDashboard = () => {
  const adminSections = [
    {
      id: 'users',
      label: 'Gestión de Usuarios',
      icon: <UsersIcon />,
      component: <UserRoleManagement />,
    },
  ]
  const [activeSection, setActiveSection] = useState(adminSections[0].id)

  return (
    <DashboardLayout
      sections={adminSections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {adminSections.find((section) => section.id === activeSection)?.component}
        </div>
      </main>
    </DashboardLayout>
  )
}
