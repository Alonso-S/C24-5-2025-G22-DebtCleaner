import React from 'react'

interface Project {
  id: number
  title: string
  description?: string
  dueDate?: string
}

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
  isSelected: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, isSelected }) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-sm'}`}
      onClick={() => onClick(project)}
    >
      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
      {project.description && <p className="text-sm text-gray-600 mb-2">{project.description}</p>}
      <p className="text-xs text-gray-500">
        Fecha límite: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  )
}
