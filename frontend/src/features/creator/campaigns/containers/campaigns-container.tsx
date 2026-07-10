"use client"
import Image from "next/image";
import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useState } from "react"
import { CampaignTabs } from "@/src/features/creator/campaigns/components/campaign-tabs"
import { CampaignList } from "@/src/features/creator/campaigns/components/campaign-list"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react";
import { useCampaigns } from "@/src/features/creator/campaigns/hooks/useCampaign"
import LogoLoader from "@/src/components/molecules/logo-loader";

export default function Campaigns() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("ALL")
  const { data, isLoading, isError } = useCampaigns(user?.user_id ?? "", page)
  const router = useRouter();

  if (loading || isLoading) return <LogoLoader label="Loading campaigns" />;

  if (isError) return <p>Something went wrong.</p>;
  if (!user) return null;

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden">
        <CreatorSidebar />
        <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
            <div className="flex flex-col gap-6 p-8 w-full max-w-300 m-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between">
                      <h1 className="text-4xl font-normal text-foreground">Campaigns</h1>
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
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-[#7b7771]">{user.email}</p>
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
