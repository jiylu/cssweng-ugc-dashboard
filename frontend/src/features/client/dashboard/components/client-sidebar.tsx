import Image from "next/image";
import { Megaphone, Settings, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ClientSidebarProps {
  isSigningOut: boolean;
  onSignOut: () => void;
}

export default function ClientSidebar({
  isSigningOut,
  onSignOut,
}: ClientSidebarProps) {
  return (
    <aside className="flex h-screen w-[300px] shrink-0 flex-col border-r border-[#d8d4cb] bg-[#f2f0ea] px-9 py-10">
      <Image
        src="/Logo-black.svg"
        alt="Asceoft"
        className="mb-9 h-auto w-[150px]"
        width={150}
        height={40}
        priority
      />

      <Separator />

      <nav className="mt-14 flex flex-col gap-5">
        <Button
          type="button"
          variant="ghost"
          className="h-12 justify-start gap-4 px-0 text-lg font-normal text-[#6b1fa8] hover:bg-transparent hover:text-[#6b1fa8]"
        >
          <Megaphone className="size-6" />
          Campaigns
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-12 justify-start gap-4 px-0 text-lg font-normal text-[#7b7771] hover:bg-transparent"
        >
          <Settings className="size-6" />
          Settings
        </Button>
      </nav>

      <div className="mt-auto">
        <Separator className="mb-4" />
        <Button
          type="button"
          variant="ghost"
          className="h-12 justify-start gap-4 px-0 text-lg font-normal text-[#7b7771] hover:bg-transparent"
          onClick={onSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <LogOut className="size-6" />
          )}
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
