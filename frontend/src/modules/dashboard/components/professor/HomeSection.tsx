import QuickActions from '../QuickActions'
import ActivitySummary from '../ActivitySummary'
import WelcomeCard from './WelcomeCard'

interface HomeSectionProps {
  setActiveSection: (section: string) => void
}

const HomeSection = ({ setActiveSection }: HomeSectionProps) => {
  const handleNavigate = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-8 animate-fade-in">
      <WelcomeCard />
      <QuickActions onNavigate={handleNavigate} />
      <ActivitySummary />
    </div>
  )
}

export default HomeSection
