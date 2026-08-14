import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";
import type { ClientCampaign, ClientCampaignStatus } from "../types/client-campaign.types";

interface RawCampaign {
  public_id: string;
  ugc_creator_id: string;
  client_id: string | null;
  project_name: string;
  description: string | null;
  campaign_status: string;
  pricing: number;
  currency: string;
  tax: number;
  platforms: string[];
  start_date: string;
  end_date: string;
  created_at: string;
}

interface CreatorResponse {
  first_name: string;
  last_name: string;
}

interface RawProposal {
  public_id: string;
  proposal_status: string;
}

interface CampaignSetupResponse {
  campaign: RawCampaign;
  proposal: RawProposal;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString));
}

/**
 * Derives the UI-facing status from the backend campaign_status and proposal_status.
 *
 * CampaignStatus in DB: ACTIVE | REJECTED | COMPLETED | CANCELLED
 * ProposalStatus in DB: PENDING | FOR_REVISION | REJECTED | ACCEPTED | CANCELLED
 *
 * UI statuses: COMPLETE | ACTIVE | PENDING | FOR REVISIONS
 */
function deriveDisplayStatus(
  campaignStatus: string,
  proposalStatus: string,
): ClientCampaignStatus {
  if (proposalStatus === "REJECTED" || campaignStatus === "REJECTED") return "REJECTED";
  if (proposalStatus === "CANCELLED" || campaignStatus === "CANCELLED") return "CANCELLED";
  // If proposal is still pending client review, show PENDING
  if (proposalStatus === "PENDING") return "PENDING";
  // If proposal needs revision, show FOR REVISIONS
  if (proposalStatus === "FOR_REVISION") return "FOR REVISIONS";
  // If the campaign is completed, show COMPLETE
  if (campaignStatus === "COMPLETED") return "COMPLETE";
  // Default: the campaign is active
  return "ACTIVE";
}

export async function getClientCampaigns(clientId: string): Promise<ClientCampaign[]> {
  // Step 1: Fetch all campaigns for this client
  const response = await fetch(`${API_BASE_URL}/campaigns?clientId=${clientId}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load campaigns."));
  }
  const campaigns: RawCampaign[] = await response.json();

  // Step 2: For each campaign, fetch the full setup (includes proposal) and creator name
  const mappedCampaigns = await Promise.all(
    campaigns.map(async (c) => {
      // Fetch full campaign setup to get proposal status
      let proposalStatus = "ACCEPTED"; // fallback for campaigns without a fetchable setup
      try {
        const setupRes = await fetch(`${API_BASE_URL}/campaign-setup/${c.public_id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (setupRes.ok) {
          const setup: CampaignSetupResponse = await setupRes.json();
          proposalStatus = setup.proposal?.proposal_status ?? "ACCEPTED";
        }
      } catch {
        // If setup fetch fails, derive status from campaign only
      }

      // Fetch creator name
      let creatorName = "Unknown Creator";
      try {
        const creatorRes = await fetch(`${API_BASE_URL}/users/${c.ugc_creator_id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (creatorRes.ok) {
          const creator: CreatorResponse = await creatorRes.json();
          creatorName = `${creator.first_name} ${creator.last_name}`.trim();
        }
      } catch {
        // Keep fallback name
      }

      return {
        id: c.public_id,
        name: c.project_name,
        creatorName,
        startDate: formatDate(c.start_date),
        deadline: formatDate(c.end_date),
        status: deriveDisplayStatus(c.campaign_status, proposalStatus),
      };
    }),
  );

  return mappedCampaigns;
}
