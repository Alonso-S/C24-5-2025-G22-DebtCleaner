import type { SidebarSection } from '../types'
import { SidebarOptions } from './SidebarOptions'

type SidebarProps<T extends string> = {
  setActiveSection: (section: T) => void
  activeSection: T
  sections: SidebarSection<T>[]
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (isOpen: boolean) => void
}

export const Sidebar = <T extends string>({
  activeSection,
  setActiveSection,
  sections,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: SidebarProps<T>) => {
  return (
    <>
      {/* Sidebar para móvil */}
      <div className="lg:hidden">
        <div
          className="fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out"
          style={{ transform: isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {/* Overlay de fondo */}
          <div className="fixed inset-0" onClick={() => setIsMobileSidebarOpen(false)}></div>

          {/* Sidebar móvil */}
          <div className="relative flex w-80 max-w-xs flex-1 flex-col bg-white bg-opacity-90 backdrop-blur-md border-r border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-600">DebtCleaner</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SidebarOptions
              setActiveSection={setActiveSection}
              activeSection={activeSection}
              sections={sections}
            />
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white bg-opacity-80 backdrop-blur-md border-r border-gray-200">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <h2 className="text-2xl font-bold text-blue-600">DebtCleaner</h2>
              </div>
              <SidebarOptions
                setActiveSection={setActiveSection}
                activeSection={activeSection}
                sections={sections}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
