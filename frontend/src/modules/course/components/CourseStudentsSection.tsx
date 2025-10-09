import { useEffect, useState, useCallback } from 'react'
import type { Student } from '../../../shared/types'
import { courseService } from '../services/courseService'
import StudentList from './StudentList'
import { SearchIcon } from '../../../shared/components/icons/SearchIcon'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { SearchBar } from './SearchBar'

export interface CourseStudentsSectionProps {
  courseId: number
}

export const CourseStudentsSection = ({ courseId }: CourseStudentsSectionProps) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  // ✅ Reutilizable para carga inicial o recarga luego de borrar
  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const data = await courseService.getStudentsByCourse(courseId)
    setStudents(data)
    setLoading(false)
  }, [courseId])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
  }

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return

    await courseService.removeStudent(courseId, selectedStudent.id)
    setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id))
    setSelectedStudent(null)
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isEmpty = students.length === 0
  const noResults = !loading && !isEmpty && filteredStudents.length === 0

  return (
    <div className="bg-white/80 p-6 rounded-lg shadow-sm backdrop-blur-sm">
      {/* 🔍 Barra de búsqueda */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nombre o código de acceso..."
        className="relative mb-6"
      />

      {/* ⏳ Cargando */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
        </div>
      ) : noResults ? (
        // 🔍 Sin resultados
        <EmptyState
          icon={<SearchIcon className="w-5 h-5 text-gray-500" />}
          title="No se encontraron resultados"
          description="Intenta con otro nombre o correo."
        />
      ) : isEmpty ? (
        // 📭 Sin estudiantes
        <EmptyState
          icon={<SearchIcon className="w-5 h-5 text-gray-500" />}
          title="No hay estudiantes inscritos"
          description="Comparte el código de acceso para que los estudiantes se inscriban."
        />
      ) : (
        // ✅ Lista
        <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />
      )}

      {/* 🗑 Modal de confirmación */}
      {selectedStudent && (
        <ConfirmDeleteModal
          isOpen={!!selectedStudent}
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
    <div className="inline-block p-3 bg-gray-100 rounded-full mb-2">{icon}</div>
    <h3 className="text-lg font-medium text-[rgb(var(--dark-rgb))] mb-1">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)
