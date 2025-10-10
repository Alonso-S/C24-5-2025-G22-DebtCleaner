import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export const ClipboardListIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V4a1 1 0 011-1zm0 7h6m-6 4h6m-6 4h6"
    />
  </svg>
)

export default ClipboardListIcon
