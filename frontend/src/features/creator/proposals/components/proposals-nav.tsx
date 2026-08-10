import Link from "next/link"
import { cn } from "@/lib/utils"
import { PenLine, FileText, FileCheck2 } from "lucide-react"
import Profile from "@/src/components/molecules/profile";

type ProposalsTabKey = "create" | "drafts" | "submitted"

interface CreatorProposalNavigationProps {
  activeTab: ProposalsTabKey
  userFirstName: string
  userLastName: string
  userEmail: string
}

interface ProposalsTabConfigItem {
  key: ProposalsTabKey
  label: string
  href: string
  icon: React.ReactNode
}

const TAB_CONFIG: ProposalsTabConfigItem[] = [
  { key: "create", label: "Create a Proposal", href: "/proposals/create-campaign", icon: <PenLine size={16} /> },
  { key: "drafts", label: "Drafts", href: "/proposals/drafts", icon: <FileText size={16} /> },
  { key: "submitted", label: "Submitted Proposals", href: "/proposals/submitted", icon: <FileCheck2 size={16} /> },
]

export default function CreatorProposalsNavigation({ userFirstName, userLastName, userEmail, activeTab }: CreatorProposalNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-8">
        {TAB_CONFIG.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 text-sm uppercase tracking-[0.03em]",
              activeTab === tab.key
                ? "text-[#6b1fa8] font-medium"
                : "text-muted-foreground/60"
            )}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>

      <Profile 
        firstName={userFirstName}
        lastName={userLastName}
        email={userEmail}
      />
    </div>
  )
}