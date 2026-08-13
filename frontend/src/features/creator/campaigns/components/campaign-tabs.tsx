import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["ALL", "ACTIVE", "PENDING", "FOR REVISIONS", "COMPLETED"]

interface CampaignTabsProps {
  active: string
  onChange: (tab: string) => void
}

export function CampaignTabs({ active, onChange }: CampaignTabsProps) {
  return (
    // TODO: Make tabs(filters) work
    <Tabs value={active} onValueChange={onChange}>
      <TabsList className="bg-transparent p-0 gap-6 h-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="px-0 py-1 text-sm text-muted-foreground rounded-none border-transparent !bg-transparent !shadow-none focus-visible:!ring-0 data-[state=active]:text-[#6b1fa8] data-[state=active]:!bg-transparent data-[state=active]:!shadow-none"          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}