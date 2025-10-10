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

export interface Student {
  id: number
  name: string
  email: string
  role: Role
}

export interface SubmissionSummary {
  id: number
  userId: number
  projectId: number
  grade?: number | null
  createdAt: string
  fileUrl?: string | null
  gitRepositoryUrl?: string | null
}
