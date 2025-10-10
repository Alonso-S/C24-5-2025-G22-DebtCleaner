import { useState } from 'react'
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout'
import { HomeIcon } from '../../../../shared/components/icons/HomeIcon'
import JoinCourse from '../../components/JoinCourse'
import CourseListSection from './CourseListSection'
import { authStore } from '../../../../shared/store/authStore'

const Inicio = () => (
  <div className="space-y-6">
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold">Bienvenido</h2>
      <p className="text-sm text-gray-700">Aquí verás tus clases y tareas.</p>
      <button
        onClick={() => {
          const token = authStore.token || ''

          // codificar para URL (evitar problemas con caracteres especiales)
          const encodedToken = encodeURIComponent(token)

          // armar la URL que redirige al backend pasando el token en query param `state`
          const url = `${import.meta.env.VITE_API_URL}/api/github/authorize?state=${encodedToken}`

          // redireccionar navegador
          window.location.href = url
        }}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Conectar con Github
      </button>
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
      id: 'cursos',
      label: 'Mis Cursos',
      icon: <HomeIcon />,
      component: <CourseListSection />,
    },
    {
      id: 'unirse-curso',
      label: 'Unirse a un Curso',
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
