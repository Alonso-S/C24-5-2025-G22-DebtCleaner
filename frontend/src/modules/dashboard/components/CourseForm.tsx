import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void
  isLoading: boolean
}

export interface CourseFormData {
  name: string
  description: string
}

export const CourseForm = ({ onSubmit, isLoading }: CourseFormProps) => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('El nombre del curso es obligatorio')
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="relative backdrop-blur-sm bg-gray/30 p-8 rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      {/* Efecto de brillo */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[rgba(0,178,227,0.2)] rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[rgba(255,82,170,0.1)] rounded-full blur-3xl"></div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[rgb(18,24,38)] mb-1">
            Nombre del Curso <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[rgba(0,178,227,0.5)] focus:border-[rgba(0,178,227,0.5)] transition-all"
            placeholder="Ej: Introducción a la Programación"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[rgb(18,24,38)] mb-1"
          >
            Descripción (Opcional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[rgba(0,178,227,0.5)] focus:border-[rgba(0,178,227,0.5)] transition-all"
            placeholder="Describe brevemente el contenido del curso..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-[rgb(0,178,227)] to-[rgb(51,204,255)] text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse-subtle">Creando curso...</span>
            ) : (
              'Crear Curso'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
