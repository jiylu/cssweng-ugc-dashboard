import { CalendarEvent, Campaign, Deliverable } from '../types/calendar.types';

// ─── Pure Mapper ───────────────────────────────────────────────────────────────

/**
 * Converts a list of Campaign objects (each with nested deliverables) into a
 * flat CalendarEvent[] suitable for all calendar grid components.
 *
 * Produces three event types per campaign:
 *  • CAMPAIGN_DURATION — one event spanning start_date → end_date
 *  • DELIVERABLE_DUE   — one event per deliverable on its due_date
 *  • DELIVERABLE_POST  — one event per deliverable on its post_date
 *
 * This function is pure (no side-effects / no network calls) so it can be
 * used by both the real API service and the mock hook.
 */
export function mapCampaignsToEvents(campaigns: Campaign[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const campaign of campaigns) {
    // Campaign duration bar
    events.push({
      id: `camp-${campaign.campaign_id}`,
      title: campaign.project_name,
      date: new Date(campaign.start_date),
      endDate: new Date(campaign.end_date),
      type: 'CAMPAIGN_DURATION',
      status: campaign.campaign_status,
      campaignId: campaign.campaign_id,
      sourceId: campaign.campaign_id,
    });

    for (const d of campaign.deliverables) {
      if (d.is_deleted) continue;

      // Due date chip
      events.push({
        id: `due-${d.deliverable_id}`,
        title: `DUE: ${d.deliverable_content}`,
        date: new Date(d.due_date),
        type: 'DELIVERABLE_DUE',
        status: campaign.campaign_status,
        campaignId: campaign.campaign_id,
        sourceId: d.deliverable_id,
      });

      // Post date chip
      events.push({
        id: `post-${d.deliverable_id}`,
        title: `POST: ${d.deliverable_content}`,
        date: new Date(d.post_date),
        type: 'DELIVERABLE_POST',
        status: campaign.campaign_status,
        campaignId: campaign.campaign_id,
        sourceId: d.deliverable_id,
      });
    }
  }

  return events;
}

// ─── Async API Fetcher ─────────────────────────────────────────────────────────

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches campaigns + deliverables from the backend API and maps them to
 * CalendarEvent[]. Requires an authenticated creatorId.
 */
export async function getCalendarEvents(creatorId: string): Promise<CalendarEvent[]> {
  const campaigns = await getJson<any[]>(`/api/campaigns?creatorId=${creatorId}`);

  // Fetch deliverables for every campaign in parallel
  const deliverableGroups = await Promise.all(
    campaigns.map((c: any) =>
      getJson<Deliverable[]>(`/api/deliverables/campaign/${c.campaign_id ?? c.ugcId}`)
    )
  );

  // Attach deliverables to each campaign to match the Campaign interface shape
  const enriched: Campaign[] = campaigns.map((c: any, i) => ({
    campaign_id:     c.campaign_id ?? c.ugcId,
    public_id:       c.public_id   ?? c.ugcId,
    ugc_creator_id:  c.ugc_creator_id ?? c.creatorId ?? '',
    client_id:       c.client_id,
    project_name:    c.project_name  ?? c.projectName,
    description:     c.description   ?? '',
    currency:        c.currency      ?? 'USD',
    tax:             c.tax           ?? 0,
    pricing:         c.pricing       ?? 0,
    platforms:       c.platforms     ?? [],
    start_date:      c.start_date    ?? c.startDate,
    end_date:        c.end_date      ?? c.endDate,
    campaign_status: c.campaign_status ?? c.status ?? 'ACTIVE',
    deliverables:    deliverableGroups[i] ?? [],
  }));

  return mapCampaignsToEvents(enriched);
}