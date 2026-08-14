import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["ALL", "ACTIVE", "REJECTED", "COMPLETED", "CANCELLED"]

interface CampaignTabsProps {
  active: string
  onChange: (tab: string) => void
}

export function CampaignTabs({ active, onChange }: CampaignTabsProps) {
  return (
    <Tabs value={active} onValueChange={onChange}>
      <TabsList className="bg-transparent p-0 gap-6 h-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="bg-transparent px-0 py-1 text-sm text-muted-foreground rounded-none border-transparent data-[state=active]:text-[#6b1fa8]"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}