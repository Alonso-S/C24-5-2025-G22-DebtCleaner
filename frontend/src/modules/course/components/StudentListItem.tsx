import type { Student } from '../../../shared/types'
import { TrashIcon } from '../../../shared/components/icons/TrashIcon'

const StudentListItem = ({
  student,
  onDelete,
}: {
  student: Student
  onDelete: (student: Student) => void
}) => {
  return (
    <>
      <div
        className="grid grid-cols-3 gap-4 items-center bg-white/80 border border-gray-200 
                    rounded-lg px-4 py-3 shadow-sm hover:shadow"
      >
        {/* Nombre */}
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3
                        bg-[rgba(var(--primary-rgb),0.1)] text-[rgb(var(--primary-rgb))]"
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-semibold text-[rgb(var(--dark-rgb))] truncate">{student.name}</div>
        </div>

        {/* Correo */}
        <div className="text-sm text-gray-600 truncate">{student.email}</div>

        {/* Acciones */}
        <div className="flex justify-end">
          <button
            onClick={() => onDelete(student)}
            className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Eliminar estudiante"
            aria-label="Eliminar estudiante"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentListItem
