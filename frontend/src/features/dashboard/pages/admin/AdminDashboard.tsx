import { useAuth } from '../../../auth/hooks/useAuth';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
          <button 
            onClick={logout}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <p className="text-lg">
            Bienvenido, <span className="font-semibold">{user?.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Rol: <span className="font-medium text-blue-600">ADMIN</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Usuarios Registrados</h3>
            <p className="text-3xl font-bold">120</p>
            <p className="text-sm opacity-80">+5 esta semana</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Profesores Activos</h3>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm opacity-80">+3 este mes</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Estudiantes Activos</h3>
            <p className="text-3xl font-bold">280</p>
            <p className="text-sm opacity-80">+15 este mes</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">👥</span>
            Gestionar Usuarios
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">👨‍🏫</span>
            Asignar Profesores
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">🔑</span>
            Gestionar Permisos
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">⚙️</span>
            Configuración
          </button>
        </div>
      </div>
    </div>
  );
};