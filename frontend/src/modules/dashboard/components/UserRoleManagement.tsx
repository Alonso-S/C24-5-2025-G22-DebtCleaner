import { useState, useEffect } from 'react'
import { UserRoleModal } from './UserRoleModal'
import type { Role, User } from '../../../shared/types'
import { UserSearchInput } from './UserSearchInput'
import { UserTable } from './UserTable'
import { UserPagination } from './UserPagination'
import { userService } from '../../../modules/users/services/user.service'

export const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [errorLoadingUsers, setErrorLoadingUsers] = useState<string | null>(null)
  const usersPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers()
        setUsers(fetchedUsers.data || [])
      } catch (error) {
        setErrorLoadingUsers('Error al cargar los usuarios.')
        console.error('Error fetching users:', error)
      } finally {
        setIsLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleEditRole = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveRole = async (userId: string, newRole: Role) => {
    try {
      const updatedUser = await userService.updateUserRole(userId, newRole)
      setUsers(users.map((user) => (user.id === userId ? updatedUser.data || user : user)))
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error saving role:', error)
      // Optionally, show an error message to the user
    }
  }

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-200 text-red-800'
      case 'PROFESSOR':
        return 'bg-blue-200 text-blue-800'
      case 'STUDENT':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-fade-in-up">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
        Gestión de Roles de Usuario
      </h2>

      <UserSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoadingUsers && <p className="text-center text-gray-600">Cargando usuarios...</p>}
      {errorLoadingUsers && <p className="text-center text-red-600">{errorLoadingUsers}</p>}

      {!isLoadingUsers && !errorLoadingUsers && (
        <>
          <UserTable
            currentUsers={currentUsers}
            handleEditRole={handleEditRole}
            getRoleBadgeClass={getRoleBadgeClass}
          />

          <UserPagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
        </>
      )}

      {selectedUser && (
        <UserRoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveRole}
        />
      )}
    </div>
  )
}
