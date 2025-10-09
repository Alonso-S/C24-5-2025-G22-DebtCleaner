interface ActionCardProps {
  title: string
  description: string
  color: string
  icon: React.ReactNode
  onClick: () => void
  cta: string
}

const ActionCard = ({ title, description, color, icon, onClick, cta }: ActionCardProps) => {
  return (
    <button className="group relative overflow-hidden p-6 rounded-xl backdrop-blur-sm bg-white/30 border border-white/20 shadow-md hover:shadow-lg hover:bg-white/40 transition-all duration-300">
      <div className="relative z-10 flex items-start">
        <div className="p-3 rounded-full bg-white/60 mr-4">{icon}</div>
        <div className="text-left">
          <h3 className="text-xl font-bold text-[rgb(18,24,38)]">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
          <div
            onClick={onClick}
            className={`mt-4 text-[${color}] font-medium group-hover:translate-x-2 transition-transform duration-300`}
          >
            {cta} →
          </div>
        </div>
      </div>
    </button>
  )
}

export default ActionCard
