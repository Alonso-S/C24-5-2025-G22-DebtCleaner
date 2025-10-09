import type { ChangeEvent } from 'react'
import { SearchIcon } from '../../../shared/components/icons/SearchIcon'

interface SearchBarProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="text-gray-400 w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white
                   focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)]
                   focus:border-[rgba(var(--primary-rgb),0.5)]"
      />
    </div>
  )
}
