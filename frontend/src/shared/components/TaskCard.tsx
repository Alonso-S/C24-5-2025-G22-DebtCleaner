import React from 'react'

interface TaskCardProps {
  title?: string;
  description?: string;
  dueDate?: string;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  dueDate,
  children,
  className = '',
  header,
  footer,
  onClick,
}) => {
  return (
    <div className={`p-4 rounded-lg ${className}`} onClick={onClick}> {/* Simplified default styling */}
      {header ? (
        <div className="mb-2">{header}</div>
      ) : (
        title && <h3 className="text-xl font-semibold mb-2">{title}</h3>
      )}
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      {dueDate && (
        <p className="text-sm text-gray-500 mb-4">
          Fecha límite: {dueDate ? new Date(dueDate).toLocaleString() : 'N/A'}
        </p>
      )}
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-4 border-t pt-4">{footer}</div>} {/* Add footer */}
    </div>
  )
}

export default TaskCard