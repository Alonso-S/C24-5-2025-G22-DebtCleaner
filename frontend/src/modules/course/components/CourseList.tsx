import { useState, useEffect } from 'react'
import { courseService } from '../services/courseService'
import type { CourseDetails } from '../../dashboard/components/CourseSuccessModal'
import { copyToClipboard } from '../../../shared/utils/copyToClipboard'
import { CourseCard } from './CourseCard'
import { CourseModal } from './CourseModal'
import { SearchBar } from './SearchBar'
import { EmptyState } from './EmptyState'
import { CourseManagement } from '../pages/CourseManagement'

export const CourseList = () => {
  const [courses, setCourses] = useState<CourseDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [managingCourseId, setManagingCourseId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await courseService.getCourses()
        setCourses(data)
      } catch (err) {
        setError('Error al cargar los cursos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.accessCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const handleCourseClick = (course: CourseDetails) => {
    setSelectedCourse(course)
    setShowModal(true)
  }

  const handleCopyCode = (code: string) => {
    copyToClipboard(code, 'Código copiado al portapapeles', 'No se pudo copiar el código')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEnterClass = (courseId: number) => {
    setManagingCourseId(courseId)
  }

  const handleReturnFromManagement = () => {
    setManagingCourseId(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgba(0,178,227,0.5)]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg p-6">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Si estamos gestionando un curso, mostrar la vista de gestión
  if (managingCourseId !== null) {
    return <CourseManagement courseId={managingCourseId} onReturn={handleReturnFromManagement} />
  }

  return (
    <div
      className="animate-fade-in p-8 overflow-auto"
      style={{ scrollBehavior: 'smooth', height: '100%' }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[rgb(18,24,38)] mb-2">Mis Cursos</h2>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar por nombre o código de acceso..."
        className="relative mb-6"
      />

      {filteredCourses.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onCardClick={handleCourseClick}
              onCopyCode={handleCopyCode}
              formatDate={formatDate}
              onEnterClass={handleEnterClass}
            />
          ))}
        </div>
      )}

      {showModal && selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setShowModal(false)}
          formatDate={formatDate}
        />
      )}
    </div>
  )
}
