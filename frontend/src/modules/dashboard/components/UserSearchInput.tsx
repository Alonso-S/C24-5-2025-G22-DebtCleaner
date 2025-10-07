interface UserSearchInputProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const UserSearchInput = ({ searchTerm, setSearchTerm }: UserSearchInputProps) => {
  return (
    <div className="mb-6 relative">
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 bg-opacity-80 transition-all duration-200 shadow-sm text-base"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  )
}
