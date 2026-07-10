import Image from 'next/image'
// import logo from '../../../../public/Logo-black.svg';
import { Separator } from '@/components/ui/separator'
import CreatorNavigation from '../molecules/creator-navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logoutUser } from '@/src/features/auth/services/auth-session'

export default function CreatorSidebar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await logoutUser();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      router.replace('/login');
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
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
        <Button
          variant="ghost"
          onClick={handleSignout}
          disabled={isSigningOut}
          className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg"
        >
          {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </section>
  )
}
