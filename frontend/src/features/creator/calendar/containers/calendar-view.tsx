"use client";

import React, { useState } from "react";
import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import { CalendarHeader } from "../components/calendar-header";
import { CalendarGrid } from "../components/calendar-grid";
import { CalendarWeekView } from "../components/calendar-week-view";
import { CalendarDayView } from "../components/calendar-day-view";
import { EventDetailModal } from "../components/event-detail-modal";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { CalendarEvent } from "../types/calendar.types";
import LogoLoader from "@/src/components/molecules/logo-loader";

type CalendarViewMode = "month" | "week" | "day";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { user, loading: authLoading } = useAuth();
  const { data: events = [], isLoading: eventsLoading } = useCalendarEvents(user?.user_id);

  const navigate = (direction: 1 | -1) => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + direction);
    else if (view === "week") d.setDate(d.getDate() + direction * 7);
    else d.setDate(d.getDate() + direction);
    setCurrentDate(d);
  };

  if (authLoading) return <LogoLoader label="Loading calendar…" />;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F2F0EA]">
      <CreatorSidebar />

      <main className="flex-1 p-8 flex flex-col items-center justify-start w-full">
        <div className="w-full max-w-6xl">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={() => navigate(-1)}
            onNextMonth={() => navigate(1)}
            onDateChange={setCurrentDate}
            view={view}
            setView={setView}
          />

          {eventsLoading ? (
            <div className="flex justify-center items-center h-64 w-full bg-white border border-[#D8D4CB] rounded-[4px]">
              <p className="text-sm text-[#78746E]">Loading calendar data…</p>
            </div>
          ) : (
            <>
              {view === "month" && (
                <CalendarGrid currentDate={currentDate} events={events} onEventClick={setSelectedEvent} />
              )}
              {view === "week" && (
                <CalendarWeekView currentDate={currentDate} events={events} onEventClick={setSelectedEvent} />
              )}
              {view === "day" && (
                <CalendarDayView currentDate={currentDate} events={events} onEventClick={setSelectedEvent} />
              )}
            </>
          )}
        </div>
      </main>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}