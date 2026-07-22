"use client";

import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import { isSameDay, format } from "date-fns";
import { getEventsForDate, formatTimeSlot, TIME_SLOTS, getCampaignDateRole } from "../calendar.utils";
import { CalendarX } from "lucide-react";

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Sort order for the all-day row:
 *   1. Campaign duration bars (broad context)
 *   2. Deliverable due-date chips
 *   3. Deliverable post-date chips
 */
const TYPE_ORDER: Record<CalendarEvent["type"], number> = {
  CAMPAIGN_DURATION: 0,
  DELIVERABLE_DUE:   1,
  DELIVERABLE_POST:  2,
};

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
}

export function CalendarDayView({ currentDate, events, onEventClick }: CalendarDayViewProps) {
  const isToday  = isSameDay(currentDate, new Date());
  const rawEvents = getEventsForDate(events, currentDate);
  const dayEvents = sortEvents(rawEvents);

  return (
    <div className="w-full bg-white border border-[#D8D4CB] rounded-[4px] shadow-sm overflow-hidden">

      {/* ── Day header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-4 bg-[#F9F8F6] border-b border-[#D8D4CB]">
        {/* Date number badge */}
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
          {/* Event count badge */}
          {dayEvents.length > 0 && (
            <span className="text-[11px] font-semibold text-[#C85A1A] bg-[#FFF3E8] px-2 py-0.5 rounded-[2px]">
              {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
            </span>
          )}
          {/* Today pill */}
          {isToday && (
            <span className="text-[11px] font-semibold text-[#6B1FA8] bg-[#F3E8FF] px-2 py-0.5 rounded-[2px]">
              Today
            </span>
          )}
        </div>
      </div>

      {/* ── All-day events row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-[80px_1fr] border-b border-[#D8D4CB] bg-[#F9F8F6]">
        <div className="border-r border-[#D8D4CB] py-3 px-3 flex items-start">
          <span className="text-[9px] font-semibold text-[#78746E] uppercase tracking-widest leading-tight">
            All<br />day
          </span>
        </div>

        <div className="py-2 px-3 min-h-[64px] flex flex-col gap-1">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 py-4">
              <CalendarX className="h-6 w-6 text-[#C9C5BE]" />
              <p className="text-xs text-[#78746E] italic">No events scheduled for this day</p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <EventChip key={event.id} event={event} onClick={onEventClick} dateRole={getCampaignDateRole(event, currentDate) ?? undefined} />
            ))
          )}
        </div>
      </div>

      {/* ── Hourly time-slot grid ─────────────────────────────────────────────── */}
      <div className="overflow-y-auto max-h-[520px] [scrollbar-gutter:stable]">
        {TIME_SLOTS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[80px_1fr] border-b border-[#D8D4CB] last:border-b-0"
          >
            <div className="py-3 px-3 border-r border-[#D8D4CB] flex items-start">
              <span className="text-[10px] text-[#78746E]">{formatTimeSlot(hour)}</span>
            </div>
            <div className="h-12 hover:bg-[#F9F8F6] transition-colors" />
          </div>
        ))}
      </div>

    </div>
  );
}
