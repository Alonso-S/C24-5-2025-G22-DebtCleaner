import StudentListItem from './StudentListItem'
import type { Student } from '../../../shared/types'

const StudentList = ({
  students,
  onDelete,
}: {
  students: Student[]
  onDelete: (student: Student) => void
}) => {
  return (
    <div className="space-y-3">
      {/* Encabezados */}
      <div
        className="grid grid-cols-3 gap-4 px-6 py-3 text-[rgb(var(--dark-rgb))] font-semibold text-sm 
                    bg-white/80 border border-gray-200 rounded-lg shadow-sm"
      >
        <div>Nombre</div>
        <div>Correo</div>
        <div className="text-right">Acciones</div>
      </div>

      {/* Lista de estudiantes */}
      <div className="space-y-2">
        {students.map((student) => (
          <div key={student.id}>
            <StudentListItem student={student} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentList
