import { useState, useEffect } from 'react'
import { UserInfoDisplay } from './UserInfoDisplay'
import type { Role, User } from '../../../shared/types'

interface UserRoleModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (userId: string, newRole: Role) => void
}

export const UserRoleModal = ({ isOpen, onClose, user, onSave }: UserRoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role || 'STUDENT')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role)
    }
  }, [user])

  if (!isOpen) return null

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      await onSave(user.id, selectedRole)
      onClose()
    } catch (err) {
      setError('Error al guardar el rol.')
      console.error('Error al guardar el rol:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-out backdrop-blur-xs">
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-3xl p-6 w-full max-w-sm border border-gray-200 transform transition-all duration-300 ease-out scale-95 animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">
          Cambiar Rol de Usuario
        </h2>

        <UserInfoDisplay user={user} />

        <div className="mb-6 space-y-3">
          <label className="flex items-center p-3 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all duration-200 shadow-sm border border-gray-200">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={selectedRole === 'ADMIN'}
              onChange={() => setSelectedRole('ADMIN')}
              className="form-radio h-5 w-5 text-blue-600 transition-colors duration-200 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900 font-semibold text-md">Administrador</span>
          </label>
          <label className="flex items-center p-3 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all duration-200 shadow-sm border border-gray-200">
            <input
              type="radio"
              name="role"
              value="professor"
              checked={selectedRole === 'PROFESSOR'}
              onChange={() => setSelectedRole('PROFESSOR')}
              className="form-radio h-5 w-5 text-blue-600 transition-colors duration-200 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900 font-semibold text-md">Profesor</span>
          </label>
          <label className="flex items-center p-3 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 transition-all duration-200 shadow-sm border border-gray-200">
            <input
              type="radio"
              name="role"
              value="student"
              checked={selectedRole === 'STUDENT'}
              onChange={() => setSelectedRole('STUDENT')}
              className="form-radio h-5 w-5 text-blue-600 transition-colors duration-200 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900 font-semibold text-md">Estudiante</span>
          </label>
        </div>

        {error && <p className="text-red-600 text-center mb-4 font-medium text-sm">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
