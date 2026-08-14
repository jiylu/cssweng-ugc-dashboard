import { API_BASE_URL } from '@/src/config/api';
import { CalendarEvent, Deliverable } from '../types/calendar.types';

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