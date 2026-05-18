import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import ExploreScreen from './ExploreScreen'

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <ExploreScreen />
      </div>
      <MobileNav />
    </div>
  )
}
