"use client";

import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import { isSameDay, format } from "date-fns";
import { getEventsForDate } from "../calendar.utils";
import { CalendarX } from "lucide-react";

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Sort order for events:
 *   1. Deliverable due-date chips
 *   2. Deliverable post-date chips
 */
const TYPE_ORDER: Record<CalendarEvent["type"], number> = {
  DELIVERABLE_DUE:  0,
  DELIVERABLE_POST: 1,
};

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
}

export function CalendarDayView({ currentDate, events, onEventClick }: CalendarDayViewProps) {
  const isToday   = isSameDay(currentDate, new Date());
  const rawEvents = getEventsForDate(events, currentDate);
  const dayEvents = sortEvents(rawEvents);

  return (
    <div className="w-full bg-white border border-[#D8D4CB] rounded-[4px] shadow-sm overflow-hidden">

      {/* ── Day header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-4 bg-[#F9F8F6] border-b border-[#D8D4CB]">
        <div
          className={[
            "w-12 h-12 flex items-center justify-center rounded-[2px] text-2xl font-semibold shrink-0",
            isToday
              ? "bg-[#6B1FA8] text-white"
              : "bg-white border border-[#D8D4CB] text-[#141518]",
          ].join(" ")}
        >
          {format(currentDate, "d")}
        </div>

        <div>
          <p className="text-base font-semibold text-[#141518]">
            {format(currentDate, "EEEE")}
          </p>
          <p className="text-sm text-[#78746E]">
            {format(currentDate, "MMMM yyyy")}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {dayEvents.length > 0 && (
            <span className="text-[11px] font-semibold text-[#C85A1A] bg-[#FFF3E8] px-2 py-0.5 rounded-[2px]">
              {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
            </span>
          )}
          {isToday && (
            <span className="text-[11px] font-semibold text-[#6B1FA8] bg-[#F3E8FF] px-2 py-0.5 rounded-[2px]">
              Today
            </span>
          )}
        </div>
      </div>

      {/* ── Events ──────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 bg-white">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1.5 py-8">
            <CalendarX className="h-6 w-6 text-[#C9C5BE]" />
            <p className="text-xs text-[#78746E] italic">No events scheduled for this day</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {dayEvents.map((event) => (
              <EventChip key={event.id} event={event} onClick={onEventClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
