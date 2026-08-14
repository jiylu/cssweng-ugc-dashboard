import { API_BASE_URL } from '@/src/config/api';
import { CalendarEvent, Campaign, Deliverable } from '../types/calendar.types';

/**
 * Converts a list of Campaign objects (each with nested deliverables) into a
 * flat CalendarEvent[]. Used by the mock hook; this function is pure (no
 * side-effects / no network calls).
 */
export function mapCampaignsToEvents(campaigns: Campaign[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const campaign of campaigns) {
    for (const d of campaign.deliverables) {
      if (d.is_deleted) continue;

      const label = `${campaign.project_name} - ${d.deliverable_content}`;

      // Due date chip
      events.push({
        id: `due-${d.public_id}`,
        title: label,
        date: new Date(d.due_date),
        type: 'DELIVERABLE_DUE',
        status: campaign.campaign_status,
        campaignId: campaign.public_id,
        sourceId: d.public_id,
        campaignName: campaign.project_name,
        campaignCurrency: campaign.currency,
        deliverable: d,
      });

      // Post date chip
      events.push({
        id: `post-${d.public_id}`,
        title: label,
        date: new Date(d.post_date),
        type: 'DELIVERABLE_POST',
        status: campaign.campaign_status,
        campaignId: campaign.public_id,
        sourceId: d.public_id,
        campaignName: campaign.project_name,
        campaignCurrency: campaign.currency,
        deliverable: d,
      });
    }
  }

  return events;
}

interface ApiCalendarEntry {
  campaignName: string;
  deliverableName: string;
  deliverableType: "COLLABORATION" | "UGC";
  deliverableRequirements: string;
  deliverablePublicId: string;
  dueDate: string;
  postDate: string;
}

export async function getCalendarEvents(creatorId: string): Promise<CalendarEvent[]> {
  const res = await fetch(
    `${API_BASE_URL}/deliverables/calendar/${creatorId}`,
    { credentials: 'include' }
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch calendar data: ${res.status}`);
  }
  
  const entries: ApiCalendarEntry[] = await res.json();
  const events: CalendarEvent[] = [];

  for (const entry of entries) {
    const label = `${entry.campaignName} - ${entry.deliverableName}`;
    
    // Construct a partial deliverable object for the details modal
    const deliverable = {
      public_id: entry.deliverablePublicId,
      deliverable_content: entry.deliverableName,
      deliverable_type: entry.deliverableType,
      requirements: entry.deliverableRequirements,
      due_date: entry.dueDate,
      post_date: entry.postDate,
    } as Deliverable;

    if (entry.dueDate) {
      events.push({
        id: `due-${entry.deliverablePublicId}`,
        title: label,
        date: new Date(entry.dueDate),
        type: 'DELIVERABLE_DUE',
        status: 'ACTIVE', // The API only returns active campaigns
        sourceId: entry.deliverablePublicId,
        campaignName: entry.campaignName,
        deliverable,
      });
    }

    if (entry.postDate) {
      events.push({
        id: `post-${entry.deliverablePublicId}`,
        title: label,
        date: new Date(entry.postDate),
        type: 'DELIVERABLE_POST',
        status: 'ACTIVE', // The API only returns active campaigns
        sourceId: entry.deliverablePublicId,
        campaignName: entry.campaignName,
        deliverable,
      });
    }
  }

  return events;
}