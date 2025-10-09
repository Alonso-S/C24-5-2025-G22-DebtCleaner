import { useState } from 'react'
import { courseService } from '../../course/services/courseService'

const JoinCourse = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmed = code.trim()
    if (!trimmed) {
      setError('El código es requerido')
      return
    }

    setIsSubmitting(true)
    try {
      await courseService.joinCourse(trimmed)
      setSuccess('Te has unido a la clase correctamente')
      setCode('')
    } catch (err) {
      console.error('Join course error:', err)
      setError('No se pudo unirse a la clase. Verifica el código.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fade">
      <h4 className="text-lg font-semibold mb-3">Unirse a una clase</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código de la clase
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm border-gray-200 focus:ring-2 focus:ring-opacity-60 focus:ring-blue-300 ${
              error ? 'border-red-300' : ''
            }`}
            placeholder="Ej: ABC123"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-1 text-sm text-green-600">{success}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Uniendo...' : 'Unirse'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JoinCourse
