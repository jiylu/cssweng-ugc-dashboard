import { isSameDay } from "date-fns";
import { CalendarEvent } from "./types/calendar.types";

export type CampaignDateRole = 'start' | 'end' | 'middle';

/**
 * Normalizes a Date to local midnight (00:00:00) so that calendar cell
 * comparisons are date-only. This prevents UTC offset off-by-one errors
 * when API timestamps like "2026-06-07T00:00:00.000Z" are compared against
 * local calendar cells in UTC+8 and similar positive-offset timezones.
 */
export function toLocalMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Returns all events that fall on a given day.
 *
 * - CAMPAIGN_DURATION: matches every day within [startDate, endDate] inclusive,
 *   so the chip appears on each day of the campaign range (chip-per-day strategy).
 * - All other event types: exact single-day match.
 */
export function getEventsForDate(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const cell = toLocalMidnight(day);

  return events.filter((event) => {
    const start = toLocalMidnight(new Date(event.date));

    if (event.type === "CAMPAIGN_DURATION" && event.endDate) {
      const end = toLocalMidnight(new Date(event.endDate));
      return cell >= start && cell <= end;
    }

    return isSameDay(start, cell);
  });
}

/**
 * Determines whether a CAMPAIGN_DURATION event is being viewed on its
 * start date, end date, or a middle day — used to color-code chips.
 */
export function getCampaignDateRole(event: CalendarEvent, day: Date): CampaignDateRole | null {
  if (event.type !== "CAMPAIGN_DURATION" || !event.endDate) return null;
  const cell  = toLocalMidnight(day);
  const start = toLocalMidnight(new Date(event.date));
  const end   = toLocalMidnight(new Date(event.endDate));
  if (cell.getTime() === start.getTime()) return 'start';
  if (cell.getTime() === end.getTime()) return 'end';
  return 'middle';
}
