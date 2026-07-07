import { CalendarEvent } from "../types/calendar.types";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getCalendarEvents(creatorId: string): Promise<CalendarEvent[]> {
  const campaigns = await getJson<any[]>(`/api/campaigns?creatorId=${creatorId}`);
  const events: CalendarEvent[] = [];

  for (const campaign of campaigns) {
    events.push({
      id: `camp-${campaign.ugcId}`,
      title: campaign.projectName,
      date: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      type: "CAMPAIGN_DURATION",
      status: "ACTIVE",
      campaignId: campaign.ugcId,
    });
  }

  const deliverableGroups = await Promise.all(
    campaigns.map((c: any) => getJson<any[]>(`/api/deliverables/campaign/${c.ugcId}`))
  );

  for (const deliverables of deliverableGroups) {
    for (const d of deliverables) {
      const rawId = d.deliverableId ?? d.id;
      events.push({
        id: `due-${rawId}`,
        title: `DUE: ${d.deliverableContent ?? "Deliverable"}`,
        date: new Date(d.dueDate),
        type: "DELIVERABLE_DUE",
        campaignId: d.campaignId,
      });
      events.push({
        id: `post-${rawId}`,
        title: `POST: ${d.deliverableContent ?? "Deliverable"}`,
        date: new Date(d.postDate),
        type: "DELIVERABLE_POST",
        campaignId: d.campaignId,
      });
    }
  }

  return events;
}