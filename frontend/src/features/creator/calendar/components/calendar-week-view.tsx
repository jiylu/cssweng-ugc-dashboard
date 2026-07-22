"use client";

import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { getEventsForDate, getCampaignDateRole } from "../calendar.utils";

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Groups events into campaign-duration bars vs individual deliverable chips
 * so the all-day row shows campaigns first, then due / post deliverables.
 */
function partitionEvents(events: CalendarEvent[]): {
  campaigns: CalendarEvent[];
  deliverables: CalendarEvent[];
} {
  return {
    campaigns:    events.filter((e) => e.type === "CAMPAIGN_DURATION"),
    deliverables: events.filter((e) => e.type !== "CAMPAIGN_DURATION"),
  };
}

/**
 * Day header + all-day event row share the same viewport width — including
 * the scrollbar gutter — guaranteeing perfectly aligned vertical grid lines.
 * The day-header row uses `sticky` positioning to remain visible if the
 * all-day row overflows.
 */
export function CalendarWeekView({ currentDate, events, onEventClick }: CalendarWeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today     = new Date();

  return (
    <div className="w-full border border-[#D8D4CB] rounded-[4px] shadow-sm overflow-hidden">
      {/* ── Day-name / date-number header ────────────────────────────────── */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] bg-[#F9F8F6] border-b border-[#D8D4CB]">
          <div className="border-r border-[#D8D4CB] py-3" />
          {weekDays.map((day, i) => {
            const isToday     = isSameDay(day, today);
            const dayEvents   = getEventsForDate(events, day);
            const eventCount  = dayEvents.length;

            return (
              <div key={i} className="py-3 text-center border-r border-[#D8D4CB] last:border-r-0 relative">
                <p className="text-xs font-semibold text-[#78746E] uppercase tracking-wider">
                  {format(day, "EEE")}
                </p>
                <div className="relative inline-flex items-center justify-center mt-1">
                  <p
                    className={[
                      "text-base font-medium w-7 h-7 flex items-center justify-center rounded-[2px]",
                      isToday ? "bg-[#6B1FA8] text-white" : "text-[#141518]",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </p>
                  {eventCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] text-[9px] font-bold bg-[#C85A1A] text-white rounded-full flex items-center justify-center px-0.5 leading-none">
                      {eventCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── All-day event row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-[64px_repeat(7,1fr)] bg-[#F9F8F6] border-b border-[#D8D4CB]">
          <div className="border-r border-[#D8D4CB] py-2 px-2 flex items-start pt-3">
            <span className="text-[9px] font-semibold text-[#78746E] uppercase tracking-widest leading-tight">
              All<br />day
            </span>
          </div>

          {weekDays.map((day, i) => {
            const dayEvents  = getEventsForDate(events, day);
            const { campaigns, deliverables } = partitionEvents(dayEvents);
            const ordered = [...campaigns, ...deliverables];

            return (
              <div
                key={i}
                className="py-1 px-1 min-h-[52px] overflow-y-auto border-r border-[#D8D4CB] last:border-r-0 flex flex-col gap-0.5"
              >
                {ordered.length === 0 ? (
                  <span className="text-[9px] text-[#C9C5BE] italic pt-2 text-center w-full">—</span>
                ) : (
                  ordered.map((event) => (
                    <EventChip
                      key={`${event.id}-${format(day, "yyyy-MM-dd")}`}
                      event={event}
                      onClick={onEventClick}
                      dateRole={getCampaignDateRole(event, day) ?? undefined}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
}
