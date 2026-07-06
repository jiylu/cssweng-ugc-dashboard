"use client"
import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react"
import { CampaignTabs } from "@/src/features/creator/campaigns/components/campaign-tabs"
import { CampaignList } from "@/src/features/creator/campaigns/components/campaign-list"
import { Button } from "@/components/ui/button"
import { useCampaigns } from "@/src/features/creator/campaigns/hooks/useCampaign"

export default function Campaigns() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("ALL")
  const { data, isLoading, isError } = useCampaigns(user?.user_id ?? "", page)
  const router = useRouter();

  if (loading || isLoading) return (
    <div className="flex mt-5 justify-center">
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Loading...
      </Badge>
    </div>
  );

  if (isError) return <p>Something went wrong.</p>;
  if (!user) return null;

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden">
        <CreatorSidebar />
        <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
            <div className="flex flex-col gap-6 p-8 w-full max-w-325 m-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-normal text-foreground">Campaigns</h1>
                </div>
                <Separator />

                {/* Tabs + Create Button */}
                <div className="flex items-center justify-between">
                  <CampaignTabs active={activeTab} onChange={setActiveTab} />
                  <Button onClick={() => router.push('/create-campaign')} className="px-5 py-2 cursor-pointer">
                    + Create Proposal
                  </Button>
                </div>

                {/* Campaign List */}
                {/* TODO: Make total dynamic */}
                <CampaignList 
                  campaigns={data?.data ?? []}
                  total={data?.total ?? 0}
                  page={page}
                  onPageChange={setPage} 
                />
            </div>
        </section>
    </main>
  )

}