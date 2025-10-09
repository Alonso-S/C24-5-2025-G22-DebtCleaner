import { LightBulbIcon } from '../../../shared/components/icons/LightBulbIcon'

interface EmptyStateProps {
  searchTerm: string
}

export const EmptyState = ({ searchTerm }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <LightBulbIcon />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron cursos</h3>
      <p className="mt-1 text-gray-500">
        {searchTerm ? 'Intenta con otra búsqueda' : 'Aún no has creado ningún curso'}
      </p>
    </div>
  )
}