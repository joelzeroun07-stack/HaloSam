import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import HomeScreen from './HomeScreen'

export default function Page() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <HomeScreen />
      </div>
      <MobileNav />
    </div>
  )
}
