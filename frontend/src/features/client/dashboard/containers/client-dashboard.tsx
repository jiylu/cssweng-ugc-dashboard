import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import LogoLoader from "@/src/components/molecules/logo-loader";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { logoutUser } from "@/src/features/auth/services/auth-session";
import ClientCampaignCard from "../components/client-campaign-card";
import ClientCampaignTabs, {
  type ClientCampaignTab,
} from "../components/client-campaign-tabs";
import ClientDashboardHeader from "../components/client-dashboard-header";
import ClientSidebar from "../components/client-sidebar";
import type { ClientCampaign } from "../types/client-campaign.types";
import { useClientCampaigns } from "../hooks/useClientCampaigns";

function isCampaignVisible(campaign: ClientCampaign, tab: ClientCampaignTab) {
  if (tab === "ALL") return true;
  if (tab === "COMPLETED") return campaign.status === "COMPLETE";

  return campaign.status === tab;
}

export default function ClientDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ClientCampaignTab>("ALL");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: clientCampaigns = [], isLoading: isLoadingCampaigns } = useClientCampaigns(user?.user_id);

  const visibleCampaigns = useMemo(
    () =>
      clientCampaigns.filter((campaign) =>
        isCampaignVisible(campaign, activeTab),
      ),
    [activeTab, clientCampaigns],
  );

  const activeCount = clientCampaigns.filter(
    (campaign) => campaign.status === "ACTIVE",
  ).length;
  const pendingCount = clientCampaigns.filter(
    (campaign) => campaign.status === "PENDING" || campaign.status === "FOR REVISIONS",
  ).length;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await logoutUser();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading || isLoadingCampaigns) return <LogoLoader label="Loading client dashboard" />;

  if (!user) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#f2f0ea]">
      <ClientSidebar
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />

      <section className="flex-1 overflow-y-auto px-8 py-8">
        <ClientDashboardHeader
          user={user}
        />

        <div className="mt-8 border-b border-[#d8d4cb] pb-4">
          <h2 className="text-[58px] leading-none text-[#141518]">
            Campaigns
          </h2>
          <p className="mt-3 text-lg text-[#6f6a63]">
            You have {activeCount} active campaign
            {activeCount === 1 ? "" : "s"} and {pendingCount} proposal
            {pendingCount === 1 ? "" : "s"} waiting.
          </p>
        </div>

        <div className="mt-1">
          <ClientCampaignTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-16 space-y-6">
          {visibleCampaigns.map((campaign) => (
            <ClientCampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        <footer className="mt-16 border-t border-[#d8d4cb] pt-3 text-lg text-[#141518]">
          Showing {visibleCampaigns.length} out of {clientCampaigns.length} Campaigns
        </footer>
      </section>
    </main>
  );
}
