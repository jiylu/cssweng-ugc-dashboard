"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { ClientCampaign } from "../types/client-campaign.types";

const statusStyles: Record<ClientCampaign["status"], string> = {
  COMPLETE: "border-[#1f8a4a] bg-[#1f8a4a] text-white",
  ACTIVE: "border-[#7bb184] bg-[#eeeae2] text-[#44403b]",
  PENDING: "border-[#d8d4cb] bg-[#eeeae2] text-[#44403b]",
  "FOR REVISIONS": "border-[#6b1fa8] bg-[#f5effb] text-[#6b1fa8]",
  REJECTED: "border-[#dc2626] bg-[#fee2e2] text-[#dc2626]",
  CANCELLED: "border-[#78746e] bg-[#f5f5f5] text-[#78746e]",
};

interface ClientCampaignCardProps {
  campaign: ClientCampaign;
}

export default function ClientCampaignCard({
  campaign,
}: ClientCampaignCardProps) {
  const router = useRouter();
  const opensProposal = ["PENDING", "FOR REVISIONS", "REJECTED", "CANCELLED"].includes(
    campaign.status,
  );
  const actionLabel =
    opensProposal ? "View Proposal" : "Open Workspace";

  return (
    <article className="grid min-h-[106px] grid-cols-[300px_1px_1fr_1px_300px] items-center rounded border border-[#d8d4cb] bg-white px-8 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="min-w-0 pl-10 pr-6">
        <h2
          className="truncate text-[30px] leading-none text-[#141518]"
          title={campaign.name}
        >
          {campaign.name}
        </h2>
        <p
          className="mt-2 truncate text-lg leading-none text-[#7b7771]"
          title={campaign.creatorName}
        >
          {campaign.creatorName}
        </p>
      </div>

      <div className="h-[76px] w-px bg-[#d8d4cb]" />

      <div className="grid grid-cols-2 px-10 text-lg text-[#141518]">
        <div>
          <p>Start Date</p>
          <p className="mt-2 text-base text-[#7b7771]">{campaign.startDate}</p>
        </div>
        <div>
          <p>Deadline</p>
          <p className="mt-2 text-base text-[#7b7771]">{campaign.deadline}</p>
        </div>
      </div>

      <div className="h-[76px] w-px bg-[#d8d4cb]" />

      <div className="flex items-center justify-end gap-4">
        <span
          className={cn(
            "flex h-8 w-[132px] items-center justify-center border text-sm",
            statusStyles[campaign.status],
          )}
        >
          {campaign.status}
        </span>
        <Button
          type="button"
          variant="outline"
          className="h-9 w-[148px] rounded-none border-[#6b1fa8] bg-white text-base font-normal text-[#44403b] hover:bg-[#f7f2fb]"
          disabled={campaign.status === "REJECTED" || campaign.status === "CANCELLED"}
          onClick={() =>
            router.push(
              opensProposal && campaign.proposalId
                ? `/proposals/${campaign.proposalId}`
                : `/client-workspace/${campaign.id}`,
            )
          }
        >
          {campaign.status === "REJECTED" ? "Declined" : campaign.status === "CANCELLED" ? "Cancelled" : actionLabel}
        </Button>
      </div>
    </article>
  );
}
