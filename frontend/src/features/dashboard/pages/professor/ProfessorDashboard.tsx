import { useAuth } from '../../../auth/hooks/useAuth';

export const ProfessorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Portal del Profesor</h1>
          <button 
            onClick={logout}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg mb-6">
          <p className="text-lg">
            Bienvenido, <span className="font-semibold">{user?.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Rol: <span className="font-medium text-purple-600">PROFESSOR</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Estudiantes Asignados</h3>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm opacity-80">En 3 cursos diferentes</p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Tareas Pendientes</h3>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm opacity-80">Por revisar y calificar</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-lg text-white shadow-md">
            <h3 className="font-bold mb-2">Cursos Activos</h3>
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm opacity-80">Clean Code, Patrones, Testing</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">👥</span>
            Ver Estudiantes
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">📚</span>
            Gestionar Cursos
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">✅</span>
            Revisar Tareas
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <span className="mr-2">💻</span>
            Repositorios de Código
          </button>
        </div>
      </div>
    </div>
  );
};