"use client"

import { Button } from "@/components/ui/button";
import { Calendar, LayoutPanelTop, Megaphone, NotebookPen, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function CreatorNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const navButtonClass = (active: boolean) => cn(
    "justify-start items-center cursor-pointer w-full h-12.5 text-lg",
    active && "bg-[#6b1fa8]/10 text-[#6b1fa8] font-medium hover:bg-[#6b1fa8]/15 hover:text-[#6b1fa8]"
  )

  return (
    <div className="flex flex-col justify-start w-full">
      <Button type="button" onClick={() => router.push('/proposals/create-campaign')} className="cursor-pointer w-full lg:w-47 h-12.5 mt-10 mb-6 text-base lg:text-lg">
        + New Campaign
      </Button>
      <div className="flex flex-col justify-start items-start">
        <Button variant="ghost" onClick={() => router.push('/creator-dashboard')} className={navButtonClass(pathname === "/creator-dashboard")}>
          <LayoutPanelTop className="-mt-2 mr-2"/>Dashboard
        </Button>
        <Button variant="ghost" onClick={() => router.push('/campaigns')} className={navButtonClass(pathname.startsWith("/campaigns"))}>
          <Megaphone className="-mt-2 mr-2"/>Campaigns
        </Button>
        <Button variant="ghost" onClick={() => router.push('/proposals/submitted')} className={navButtonClass(pathname.startsWith("/proposals"))}>
          <NotebookPen className="-mt-2 mr-2"/>Proposals
        </Button>
        <Button variant="ghost" onClick={() => router.push('/calendar')} className={navButtonClass(pathname.startsWith("/calendar"))}>
          <Calendar className="-mt-2 mr-2"/>Calendar
        </Button>
        <Button variant="ghost" onClick={() => router.push('/settings')} className={navButtonClass(pathname.startsWith("/settings"))}>
          <Settings className="-mt-2 mr-2"/>Settings
        </Button>
      </div>
    </div>
  )
}
