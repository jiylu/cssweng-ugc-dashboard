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

/** Formats a 24-hour slot index (8–21) as a 12-hour AM/PM string, e.g. "8:00 AM". */
export function formatTimeSlot(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:00 ${suffix}`;
}

/** Hourly time slots shown in the Week and Day timeline grids (8 AM – 9 PM). */
export const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 8);
