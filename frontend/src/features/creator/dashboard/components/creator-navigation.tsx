import { Button } from "@/components/ui/button";
import { Calendar, LayoutPanelTop, Megaphone, NotebookPen, Settings } from "lucide-react";
import { useRouter } from "next/navigation"

export default function CreatorNavigation() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-start">
      <Button type="button" onClick={() => router.push('/createCampaign')} className="cursor-pointer w-57 h-12.5 mt-10 mb-6 text-lg">
        + New Campaign
      </Button>
      <div className="flex flex-col justify-start items-start">
        <Button variant="ghost" onClick={() => router.push('/creatorDashboard')} className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <LayoutPanelTop />Dashboard
        </Button>
        <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <Megaphone />Campaigns
        </Button>
        <Button variant="ghostactive" onClick={() => router.push('/createCampaign')} className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <NotebookPen />Proposals
        </Button>
        <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <Calendar />Calendar
        </Button>
        <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-12.5 text-lg">
          <Settings />Settings
        </Button>
      </div>
    </div>
  )
}