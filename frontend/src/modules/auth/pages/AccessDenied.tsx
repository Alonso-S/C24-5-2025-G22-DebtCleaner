import { useNavigate } from 'react-router-dom'
import { WarningIcon } from '../../../shared/components/icons/WarningIcon'
interface AccessDeniedProps {
  message?: string
}

export const AccessDenied = ({
  message = 'No tienes permisos para acceder a esta sección',
}: AccessDeniedProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg backdrop-blur-sm bg-opacity-80 border border-gray-100">
        <div className="text-center">
          <div className="mb-6 text-red-500 flex justify-center">
            <WarningIcon />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>

          <div className="h-1 w-16 bg-red-500 mx-auto my-4 rounded-full"></div>

          <p className="text-gray-600 mb-8">{message}</p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
