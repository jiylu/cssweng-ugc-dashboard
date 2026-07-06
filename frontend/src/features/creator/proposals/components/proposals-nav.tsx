import Button from "@/src/components/atoms/button";
import { FilePen, Files, StickyNote } from "lucide-react";
//import Image from "next/image";

export default function CreatorProposalsNavigation() {
  return (
    <div className="flex justify-between items-center mb-1">
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
      {/* <Image
        src='/default-profile.png'
        alt="default"
        className="w-10 mr-5 rounded-full"
        width={30}
        height={30}
      /> */}
    </div>
  )
}