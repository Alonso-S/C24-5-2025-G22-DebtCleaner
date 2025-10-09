import { useState } from 'react'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { Sidebar } from '../components/Sidebar'
import type { SidebarSection } from '../types'
import { Toaster } from 'react-hot-toast'

interface DashboardLayoutProps<T extends string> {
  sections: SidebarSection<T>[]
  children: React.ReactNode
  activeSection: T
  setActiveSection: (section: T) => void
}
const roleLabels: Record<string, string> = {
  STUDENT: 'ESTUDIANTE',
  ADMIN: 'ADMINISTRADOR',
  PROFESSOR: 'PROFESOR',
}

export const DashboardLayout = <T extends string>({
  children,
  sections,
  activeSection,
  setActiveSection,
}: DashboardLayoutProps<T>) => {
  const { user } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barra superior */}
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white bg-opacity-80 backdrop-blur-md shadow-sm">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {sections.find((section) => section.id === activeSection)?.label}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {roleLabels[user?.role || ''] || user?.role || ''}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Área de contenido principal */}

        {children}
        <Toaster position="bottom-right" />
      </div>
    </div>
  )
}
