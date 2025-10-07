export type Role = 'ADMIN' | 'PROFESSOR' | 'STUDENT'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export type SidebarSection<T extends string> = {
  id: T
  label: string
  icon?: React.ReactNode
}
