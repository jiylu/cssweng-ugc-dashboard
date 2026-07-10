import Button from "@/src/components/atoms/button";
import { FilePen, Files, StickyNote } from "lucide-react";
import Profile from "@/src/components/molecules/profile";

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
      <Profile 
        firstName={userFirstName}
        lastName={userLastName}
        email={userEmail}
      />
    </div>
  )
}