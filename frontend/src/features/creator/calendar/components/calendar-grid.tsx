import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import { getEventsForDate, toLocalMidnight } from "../calendar.utils";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS_PER_CELL = 3;

function getEventsForDayCell(
  events: CalendarEvent[],
  year: number,
  month: number,
  day: number
): CalendarEvent[] {
  return getEventsForDate(events, new Date(year, month, day));
}

export function CalendarGrid({ currentDate, events, onEventClick }: CalendarGridProps) {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = toLocalMidnight(new Date());

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const paddingCells    = Array.from({ length: firstDayOfMonth });
  const monthDays       = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function isToday(day: number): boolean {
    const cell = new Date(year, month, day);
    return toLocalMidnight(cell).getTime() === today.getTime();
  }

  return (
    <div className="w-full bg-white border border-[#D8D4CB] rounded-[4px] shadow-sm overflow-hidden">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 bg-[#F9F8F6] border-b border-[#D8D4CB]">
        {DAYS_OF_WEEK.map((label, i) => (
          <div
            key={i}
            className="py-3 text-center text-xs font-semibold text-[#78746E] uppercase tracking-wider border-r border-[#D8D4CB] last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7 bg-[#D8D4CB] gap-[1px]">
        {paddingCells.map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[120px] bg-[#F9F8F6]" />
        ))}

        {monthDays.map((day) => {
          const dayEvents = getEventsForDayCell(events, year, month, day);
          const visible   = dayEvents.slice(0, MAX_CHIPS_PER_CELL);
          const overflow  = dayEvents.length - MAX_CHIPS_PER_CELL;

          return (
            <div key={`day-${day}`} className="min-h-[120px] bg-white p-2">
              {/* Day number badge */}
              <div className="flex items-center justify-start mb-1">
                <span
                  className={[
                    "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-[2px]",
                    isToday(day) ? "bg-[#6B1FA8] text-white" : "text-[#141518]",
                  ].join(" ")}
                >
                  {day}
                </span>
              </div>

              {/* Event chips — compact mode for tight cells */}
              <div className="flex flex-col gap-0.5">
                {visible.map((event) => (
                  <EventChip
                    key={`${event.id}-${day}`}
                    event={event}
                    onClick={onEventClick}
                    compact
                  />
                ))}
                {overflow > 0 && (
                  <span className="text-[10px] text-[#78746E] pl-1 leading-tight">
                    +{overflow} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}