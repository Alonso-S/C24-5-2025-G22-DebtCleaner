import React from 'react'

interface CommentAvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  role?: string
}

export const CommentAvatar: React.FC<CommentAvatarProps> = ({ 
  name, 
  size = 'md',
  role
}) => {
  const initial = name?.charAt(0).toUpperCase() || '?'
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  }
  
  const bgColorClass = role === 'professor' 
    ? 'bg-indigo-100 text-indigo-700' 
    : 'bg-blue-100 text-blue-700'
  
  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColorClass} flex items-center justify-center font-bold`}>
      {initial}
    </div>
  )
}