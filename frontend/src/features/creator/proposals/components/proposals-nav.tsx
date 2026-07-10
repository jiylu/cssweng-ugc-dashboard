import Button from "@/src/components/atoms/button";
import { FilePen, Files, StickyNote } from "lucide-react";
import Image from "next/image";
import { Bell } from "lucide-react";

interface CreatorProposalNavigationProps {
  userFirstName: string
  userLastName: string
  userEmail: string
}

export default function CreatorProposalsNavigation({ userFirstName, userLastName, userEmail }: CreatorProposalNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex gap-8">
        <Button
          selected={true}
          variant="ghost"
          className="pb-1 flex items-center gap-1"
        >
          <FilePen
            size={18}
            className="mb-1" />
          CREATE A PROPOSAL
        </Button>
        <Button
          variant="ghost"
          className="pb-1 flex items-center gap-1"
        >
          <StickyNote
            size={18}
            className="mb-1"
          />
          DRAFTS
        </Button>
        <Button
          variant="ghost"
          className="pb-1 flex items-center gap-1"
        >
          <Files
            size={18}
            className="mb-1"
          />
          SUBMITTED PROPOSALS
        </Button>
      </div>
      <div className="flex items-center gap-6 pt-2">
        <button
          type="button"
          className="text-[#77736d] transition hover:text-[#141518]"
          aria-label="Notifications"
        >
          <Bell className="size-8" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base leading-tight text-[#141518]">
              {userFirstName} {userLastName}
            </p>
            <p className="text-sm text-[#7b7771]">{userEmail}</p>
          </div>
          <Image
            src="/default-profile.png"
            alt=""
            className="size-[46px] rounded-full"
            width={46}
            height={46}
          />
        </div>
      </div>
    </div>
  )
}