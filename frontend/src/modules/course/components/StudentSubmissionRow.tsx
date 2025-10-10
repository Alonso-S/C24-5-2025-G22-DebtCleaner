import React from 'react'
import type { Student, SubmissionSummary } from '../../../shared/types'
import { StatusBadge } from '../../../shared/components/StatusBadge'
// import { FileTextIcon, GitForkIcon, HistoryIcon } from 'lucide-react'
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../shared/components/ui/tooltip'

interface StudentSubmissionRowProps {
  student: Student
  submission?: SubmissionSummary
  onViewHistory?: (submissionId: number, student: Student) => void
}

export const StudentSubmissionRow: React.FC<StudentSubmissionRowProps> = ({
  student,
  submission,
  onViewHistory,
}) => {
  const hasSubmission = !!submission

  return (
    <div
      onClick={
        hasSubmission && onViewHistory ? () => onViewHistory(submission.id, student) : undefined
      }
      className={`flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 ${hasSubmission && onViewHistory ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-800">{student.name}</p>
        <p className="text-sm text-gray-500">{student.email}</p>
      </div>

      <div className="flex items-center space-x-4">
        {hasSubmission ? (
          <>
            <span className="text-xs text-gray-500">
              Entrega:
              <StatusBadge
                type={submission?.grade !== null ? 'success' : 'warning'}
                status={submission?.grade !== null ? 'Entregado' : 'Pendiente'}
              ></StatusBadge>
            </span>
            {submission?.fileUrl && (
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
                onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
              >
                ZIP
              </a>
            )}
            {submission?.gitRepositoryUrl && (
              <a
                href={submission.gitRepositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline text-sm"
                onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
              >
                Repo
              </a>
            )}
          </>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            No Entregado
          </span>
        )}
      </div>
    </div>
  )
}
