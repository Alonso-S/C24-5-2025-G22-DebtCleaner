import type { Role, User } from '../../../shared/types'

interface UserTableProps {
  currentUsers: User[]
  handleEditRole: (user: User) => void
  getRoleBadgeClass: (role: Role) => string
}

export const UserTable = ({ currentUsers, handleEditRole, getRoleBadgeClass }: UserTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 bg-opacity-80">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-center"
            >
              Rol
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-center"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white bg-opacity-90 divide-y divide-gray-200">
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <button
                  onClick={() => handleEditRole(user)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                >
                  Cambiar Rol
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
