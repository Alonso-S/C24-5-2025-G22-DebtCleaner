import { BookOpenIcon } from '../../../shared/components/icons/BookOpenIcon'
import { PlusCircleIcon } from '../../../shared/components/icons/PlusCircleIcon'
import ActionCard from './ActionCard'

interface QuickActionsProps {
  onNavigate: (section: string) => void
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[rgb(18,24,38)] mt-4 mb-2 px-2">
        Acciones rápidas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Mis Cursos"
          description="Accede a todos tus cursos activos, revisa el progreso de tus estudiantes y gestiona el contenido."
          icon={<BookOpenIcon />}
          onClick={() => onNavigate('cursos')}
          cta="Ver mis cursos"
          color="rgb(0,178,227)"
        />

        <ActionCard
          title="Crear Curso"
          description="Crea un nuevo curso, configura sus detalles y comienza a añadir contenido educativo."
          icon={<PlusCircleIcon />}
          onClick={() => onNavigate('crear-curso')}
          cta="Crear nuevo curso"
          color="rgb(255,82,170)"
        />
      </div>
    </div>
  )
}

export default QuickActions
