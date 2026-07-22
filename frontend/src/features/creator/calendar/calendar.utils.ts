import { isSameDay } from "date-fns";
import { CalendarEvent } from "./types/calendar.types";

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
 * Returns all events that fall on a given day (exact single-day match).
 */
export function getEventsForDate(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const cell = toLocalMidnight(day);

  return events.filter((event) => {
    const start = toLocalMidnight(new Date(event.date));
    return isSameDay(start, cell);
  });
}
