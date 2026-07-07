"use client";

import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import { isSameDay, format } from "date-fns";
import { getEventsForDate, formatTimeSlot, TIME_SLOTS } from "../calendar.utils";

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarDayView({ currentDate, events, onEventClick }: CalendarDayViewProps) {
  const isToday = isSameDay(currentDate, new Date());
  const dayEvents = getEventsForDate(events, currentDate);

  return (
    <div className="w-full bg-white border border-[#D8D4CB] rounded-[4px] shadow-sm overflow-hidden">

      <div className="flex items-center gap-4 px-6 py-4 bg-[#F9F8F6] border-b border-[#D8D4CB]">
        <div className={[
          "w-12 h-12 flex items-center justify-center rounded-[2px] text-2xl font-semibold",
          isToday ? "bg-[#6B1FA8] text-white" : "bg-white border border-[#D8D4CB] text-[#141518]",
        ].join(" ")}>
          {format(currentDate, "d")}
        </div>
        <div>
          <p className="text-base font-semibold text-[#141518]">{format(currentDate, "EEEE")}</p>
          <p className="text-sm text-[#78746E]">{format(currentDate, "MMMM yyyy")}</p>
        </div>
        {isToday && (
          <span className="ml-auto text-[11px] font-semibold text-[#6B1FA8] bg-[#F3E8FF] px-2 py-0.5 rounded-[2px]">
            Today
          </span>
        )}
      </div>

      <div className="grid grid-cols-[80px_1fr] border-b border-[#D8D4CB] bg-[#F9F8F6]">
        <div className="border-r border-[#D8D4CB] py-3 px-3 flex items-start">
          <span className="text-[9px] font-semibold text-[#78746E] uppercase tracking-widest leading-tight">
            All<br />day
          </span>
        </div>
        <div className="py-2 px-3 min-h-[64px] flex flex-col gap-1">
          {dayEvents.length === 0 ? (
            <p className="text-xs text-[#78746E] italic pt-1">No events scheduled</p>
          ) : (
            dayEvents.map((event) => (
              <EventChip key={event.id} event={event} onClick={onEventClick} />
            ))
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[520px] [scrollbar-gutter:stable]">
        {TIME_SLOTS.map((hour) => (
          <div key={hour} className="grid grid-cols-[80px_1fr] border-b border-[#D8D4CB] last:border-b-0">
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
