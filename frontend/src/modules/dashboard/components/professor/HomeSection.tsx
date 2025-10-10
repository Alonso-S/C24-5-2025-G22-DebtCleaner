import QuickActions from '../QuickActions'
import ActivitySummary from '../ActivitySummary'
import WelcomeCard from './WelcomeCard'

interface HomeSectionProps {
  userName: string
  setActiveSection: (section: string) => void
}

const HomeSection = ({ userName, setActiveSection }: HomeSectionProps) => {
  const handleNavigate = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-8 animate-fade-in">
      <WelcomeCard userName={userName} text="Gestiona tus cursos y estudiantes desde este panel." />
      <QuickActions onNavigate={handleNavigate} />
      <ActivitySummary />
    </div>
  )
}

export default HomeSection
