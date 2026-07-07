export type EventType = 'CAMPAIGN_DURATION' | 'DELIVERABLE_DUE' | 'DELIVERABLE_POST';

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