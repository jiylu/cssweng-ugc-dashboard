import Image from 'next/image'
// import logo from '../../../../public/Logo-black.svg';
import { Separator } from '@/components/ui/separator'
import CreatorNavigation from '../molecules/creator-navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreatorSidebar() {
  const router = useRouter();

  const handleSignout = () => {
    router.push('/login');
  };

  return (
    <section className="w-[18%] h-screen px-10 flex flex-col justify-start shadow-[-20px_0_60px_rgba(107,31,168,0.08)] border-r border-[#837f7b]">
      <Image 
        src="/Logo-black.svg" 
        alt="Logo" 
        className="w-37.5 mt-10 mb-10" 
        width={30}
        height={30}
      />
      <Separator />

      <CreatorNavigation />

      <div className="mt-auto mb-5 flex flex-col">
        <Separator />
        <Button variant="ghost" onClick={handleSignout} className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <LogOut />Sign Out
        </Button>
      </div>
    </section>
  )
}