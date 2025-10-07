import type { User } from '../../../shared/types'

interface UserInfoDisplayProps {
  user: User | null
}

export const UserInfoDisplay = ({ user }: UserInfoDisplayProps) => {
  if (!user) return null

  return (
    <div className="mb-6 text-center">
      <p className="text-gray-800 text-xl font-bold">{user.name}</p>
      <p className="text-gray-600 text-md">{user.email}</p>
    </div>
  )
}
