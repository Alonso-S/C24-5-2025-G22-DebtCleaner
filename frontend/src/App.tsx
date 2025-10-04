import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './features/auth/hooks/useAuth'
import { AuthPage } from './features/auth/pages/AuthPage'
import { AdminDashboard, StudentDashboard, ProfessorDashboard } from './features/dashboard'

// Componente de protección de rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  return children
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
        <Route
          path="/auth"
          element={isAuthenticated ? <RoleBasedRedirect /> : <AuthPage />}
        />

        {/* Rutas de dashboard específicas por rol */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/professor"
          element={
            <ProtectedRoute>
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
