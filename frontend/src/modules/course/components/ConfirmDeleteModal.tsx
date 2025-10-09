import type { Student } from '../../../shared/types'

const ConfirmDeleteModal = ({
  isOpen,
  student,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  student: Student
  onClose: () => void
  onConfirm: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo desenfocado */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-lg" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md p-8 bg-white/95 rounded-xl shadow-2xl border border-gray-200 animate-fade-in-up">
        <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar estudiante?</h3>
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que deseas eliminar a <strong>{student.name}</strong> del curso? Esta
          acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
