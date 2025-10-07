import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthPage } from '../modules/auth/pages/AuthPage'
import { AdminDashboard, StudentDashboard, ProfessorDashboard } from '../modules/dashboard'
import { AccessDenied } from '../modules/auth/pages/AccessDenied'

import { useAuth } from '../modules/auth/hooks/useAuth'
import type { Role } from '../shared/types'

// Componente de protección de rutas
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: Role
}) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Si se especifica un rol requerido y el usuario no tiene ese rol, mostrar acceso denegado
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <AccessDenied message={`Necesitas permisos de ${requiredRole} para acceder a esta sección`} />
    )
  }

  return <>{children}</>
}

// Componente para redirección basada en rol
const RoleBasedRedirect = () => {
  const { user } = useAuth()

  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/dashboard/admin" replace />
    case 'STUDENT':
      return <Navigate to="/dashboard/student" replace />
    case 'PROFESSOR':
      return <Navigate to="/dashboard/professor" replace />
    default:
      // Si el rol no está definido o no coincide, redirigir a una ruta por defecto
      return <Navigate to="/dashboard/student" replace />
  }
}

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <RoleBasedRedirect /> : <AuthPage />} />

        {/* Rutas de dashboard específicas por rol */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/professor"
          element={
            <ProtectedRoute requiredRole="PROFESSOR">
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta de dashboard general que redirige según el rol */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
