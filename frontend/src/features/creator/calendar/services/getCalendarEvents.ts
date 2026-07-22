import { CalendarEvent, Campaign, Deliverable } from '../types/calendar.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Pure Mapper ───────────────────────────────────────────────────────────────

/**
 * Converts a list of Campaign objects (each with nested deliverables) into a
 * flat CalendarEvent[] suitable for all calendar grid components.
 *
 * Produces two event types per campaign deliverable:
 *  • DELIVERABLE_DUE   — one event per deliverable on its due_date
 *  • DELIVERABLE_POST  — one event per deliverable on its post_date
 *
 * This function is pure (no side-effects / no network calls) so it can be
 * used by both the real API service and the mock hook.
 */
export function mapCampaignsToEvents(campaigns: Campaign[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const campaign of campaigns) {
    for (const d of campaign.deliverables) {
      if (d.is_deleted) continue;

      const label = `${campaign.project_name} - ${d.deliverable_content}`;

      // Due date chip
      events.push({
        id: `due-${d.deliverable_id}`,
        title: label,
        date: new Date(d.due_date),
        type: 'DELIVERABLE_DUE',
        status: campaign.campaign_status,
        campaignId: campaign.campaign_id,
        sourceId: d.deliverable_id,
        campaignName: campaign.project_name,
        campaignCurrency: campaign.currency,
        deliverable: d,
      });

      // Post date chip
      events.push({
        id: `post-${d.deliverable_id}`,
        title: label,
        date: new Date(d.post_date),
        type: 'DELIVERABLE_POST',
        status: campaign.campaign_status,
        campaignId: campaign.campaign_id,
        sourceId: d.deliverable_id,
        campaignName: campaign.project_name,
        campaignCurrency: campaign.currency,
        deliverable: d,
      });
    }
  }

  return events;
}

// ─── Async API Fetcher ─────────────────────────────────────────────────────────

/**
 * Fetches campaigns + deliverables from the backend API and maps them to
 * CalendarEvent[]. Requires an authenticated creatorId.
 */
export async function getCalendarEvents(creatorId: string): Promise<CalendarEvent[]> {
  const campaignsRes = await fetch(
    `${API_URL}/campaigns?creatorId=${creatorId}`,
    { credentials: 'include' }
  );
  if (!campaignsRes.ok) {
    throw new Error(`Failed to fetch campaigns: ${campaignsRes.status}`);
  }
  const campaigns: Campaign[] = await campaignsRes.json();

  // Fetch deliverables for every campaign in parallel
  const deliverableGroups = await Promise.all(
    campaigns.map(async (c) => {
      const res = await fetch(
        `${API_URL}/deliverables/campaign/${c.campaign_id}`,
        { credentials: 'include' }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch deliverables for campaign ${c.campaign_id}: ${res.status}`);
      }
      return res.json() as Promise<Deliverable[]>;
    })
  );

  // Attach deliverables to each campaign
  const enriched: Campaign[] = campaigns.map((c, i) => ({
    ...c,
    deliverables: deliverableGroups[i] ?? [],
  }));

  return mapCampaignsToEvents(enriched);
}