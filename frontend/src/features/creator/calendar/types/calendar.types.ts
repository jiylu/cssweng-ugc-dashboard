// ─── Core Event Types ──────────────────────────────────────────────────────────

export type EventType = 'CAMPAIGN_DURATION' | 'DELIVERABLE_DUE' | 'DELIVERABLE_POST';

/** Flat event record consumed by all calendar grid components. */
export interface CalendarEvent {
  id: string;           // Prefixed composite id (e.g. "camp-uuid", "due-uuid", "post-uuid")
  title: string;        // projectName or deliverableContent description
  date: Date;           // Start date (or the single event date)
  endDate?: Date;       // End date — only for CAMPAIGN_DURATION spanning blocks
  type: EventType;
  status?: string;      // e.g., ACTIVE, COMPLETED — used for color-coding chips
  campaignId?: string;  // Raw campaign ugcId this event belongs to
  sourceId?: string;    // Raw deliverableId / campaign ugcId for the detail modal
}

// ─── Domain Interfaces (matching Prisma schema / API response shapes) ──────────

export type CampaignStatus = 'ACTIVE' | 'COMPLETED' | 'REJECTED';
export type DeliverableType = 'COLLABORATION' | 'UGC';
export type CampaignCurrency = 'CAD' | 'USD' | 'PHP' | 'EUR' | 'GBP';

/** Represents one deliverable row from the Deliverables table / API response. */
export interface Deliverable {
  deliverable_id: string;
  public_id: string;
  campaign_id: string;
  quantity: number;
  deliverable_type: DeliverableType;
  /** Short human-readable description, e.g. "60-second TikTok product review". */
  deliverable_content: string;
  requirements: string;
  /** ISO date string (date-only) for when the content is due for review. */
  due_date: string;
  /** ISO date string (date-only) for when the content should go live. */
  post_date: string;
  pricing: number;
  is_deleted: boolean;
}

/** Represents one campaign row from the Campaigns table / API response. */
export interface Campaign {
  /** UUID primary key */
  campaign_id: string;
  /** Short public identifier, e.g. "UGC-001" */
  public_id: string;
  ugc_creator_id: string;
  client_id?: string;
  project_name: string;
  description: string;
  currency: CampaignCurrency;
  tax: number;
  pricing: number;
  platforms: string[];
  /** ISO date string for campaign kick-off */
  start_date: string;
  /** ISO date string for campaign completion */
  end_date: string;
  campaign_status: CampaignStatus;
  /** Nested deliverables — populated when the mock / API joins deliverables. */
  deliverables: Deliverable[];
}