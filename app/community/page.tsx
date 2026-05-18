import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import CommunityScreen from './CommunityScreen'

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <CommunityScreen />
      </div>
      <MobileNav />
    </div>
  )
}
