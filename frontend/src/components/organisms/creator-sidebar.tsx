import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import CreatorNavigation from '../molecules/creator-navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logoutUser } from '@/src/features/auth/services/auth-session'

export default function CreatorSidebar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-border"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <section className={`fixed lg:static top-0 left-0 h-screen w-[240px] lg:w-[18%] px-6 lg:px-10 flex flex-col justify-start shadow-[-20px_0_60px_rgba(107,31,168,0.08)] border-r border-border
                          bg-[#F2F0EA] z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Close button — mobile only */}
        <button
          className="lg:hidden absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

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
            className="justify-start items-center cursor-pointer w-full h-12.5 text-lg"
          >
            {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      </section>
    </>
  )
}