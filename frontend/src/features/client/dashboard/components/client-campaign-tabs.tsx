import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const clientCampaignTabs = [
  "ALL",
  "ACTIVE",
  "PENDING",
  "FOR REVISIONS",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ClientCampaignTab = (typeof clientCampaignTabs)[number];

interface ClientCampaignTabsProps {
  active: ClientCampaignTab;
  onChange: (tab: ClientCampaignTab) => void;
}

export default function ClientCampaignTabs({
  active,
  onChange,
}: ClientCampaignTabsProps) {
  return (
    <Tabs
      value={active}
      onValueChange={(value) => onChange(value as ClientCampaignTab)}
    >
      <TabsList className="h-auto gap-10 bg-transparent p-0">
        {clientCampaignTabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="rounded-none bg-transparent px-0 py-3 text-base font-normal text-[#7b7771] data-[state=active]:text-[#6b1fa8]"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
