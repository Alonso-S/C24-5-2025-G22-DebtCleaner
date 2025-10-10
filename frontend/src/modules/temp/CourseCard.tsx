import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">{course.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {studentsIcon}
            <span>{course.studentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {tasksIcon}
            <span>{course.taskCount} tareas</span>
          </div>
        </div>

        <div className="text-primary">{arrowIcon}</div>
      </div>
    </div>
  )
}

const studentsIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const tasksIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const arrowIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default CourseCard
