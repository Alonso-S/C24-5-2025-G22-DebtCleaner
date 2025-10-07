import { useAuth } from '../../modules/auth/hooks/useAuth'
import type { SidebarSection } from '../types'
import { LogoutIcon } from './icons/LogoutIcon'

interface SidebarOptionsProps<T extends string> {
  setActiveSection: (section: T) => void
  activeSection: T
  sections: SidebarSection<T>[]
}

export const SidebarOptions = <T extends string>({
  setActiveSection,
  activeSection,
  sections,
}: SidebarOptionsProps<T>) => {
  const { logout } = useAuth()
  return (
    <nav className="mt-5 flex-1 space-y-1 px-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`group flex w-full items-center px-2 py-3 text-sm font-medium rounded-md ${
            activeSection === section.id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          {section.icon}
          <span className="ml-3">{section.label}</span>
        </button>
      ))}

      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="group flex w-full items-center px-2 py-3 text-sm font-medium rounded-md text-red-700 hover:bg-red-50"
        >
          <LogoutIcon />
          <span className="ml-3">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  )
}
