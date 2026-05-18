import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import PlannerScreen from './PlannerScreen'

export default function PlannerPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <PlannerScreen />
      </div>
      <MobileNav />
    </div>
  )
}
