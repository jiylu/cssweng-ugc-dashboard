"use client";

import React, { useState } from "react";
import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import { CalendarHeader } from "../components/calendar-header";
import { CalendarGrid } from "../components/calendar-grid";
import { CalendarWeekView } from "../components/calendar-week-view";
import { CalendarDayView } from "../components/calendar-day-view";
import { EventDetailModal } from "../components/event-detail-modal";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useMockCalendarEvents } from "../hooks/useMockCalendarEvents";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import type { AuthUser } from "@/src/features/auth/schemas/auth-user.schema";
import { CalendarEvent } from "../types/calendar.types";
import LogoLoader from "@/src/components/molecules/logo-loader";
import { Separator } from "@/components/ui/separator";
import Profile from "@/src/components/molecules/profile";

// ── Toggle this flag to switch between mock data and the live API ─────────────
const USE_MOCK = false;

type CalendarViewMode = "month" | "week" | "day";

// ── Inner component receives pre-resolved auth so all hooks are unconditional ─
function CalendarInner({ user }: { user: AuthUser }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Both hooks are always called — no conditional hook calls.
  const mockResult = useMockCalendarEvents();
  const liveResult = useCalendarEvents(user.user_id);

  const { data: events = [], isLoading: eventsLoading } = USE_MOCK
    ? mockResult
    : liveResult;

  // ── Navigate by period depending on which view is active ──────────────────
  const navigate = (direction: 1 | -1) => {
    const d = new Date(currentDate);
    if      (view === "month") d.setMonth(d.getMonth() + direction);
    else if (view === "week")  d.setDate(d.getDate() + direction * 7);
    else                       d.setDate(d.getDate() + direction);
    setCurrentDate(d);
  };

  return (
    <div className="flex min-h-screen bg-[#F2F0EA]">
      <CreatorSidebar />

      <main className="flex-1 p-8 flex flex-col items-center justify-start w-full">
        <div className="w-full max-w-6xl">
          {/* Page heading + profile avatar row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-normal text-foreground">Calendar</h1>
            <Profile
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
            />
          </div>
          <Separator className="mb-6" />

          {/* Calendar controls: period label, prev/next arrows, view-mode tabs */}
          <CalendarHeader
            currentDate={currentDate}
            onPrev={() => navigate(-1)}
            onNext={() => navigate(1)}
            onDateChange={setCurrentDate}
            view={view}
            setView={setView}
          />

          {/* Calendar body */}
          {eventsLoading ? (
            <div className="flex justify-center items-center h-64 w-full bg-white border border-[#D8D4CB] rounded-[4px]">
              <p className="text-sm text-[#78746E]">Loading calendar data…</p>
            </div>
          ) : (
            <>
              {view === "month" && (
                <CalendarGrid
                  currentDate={currentDate}
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}
              {view === "week" && (
                <CalendarWeekView
                  currentDate={currentDate}
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}
              {view === "day" && (
                <CalendarDayView
                  currentDate={currentDate}
                  events={events}
                  onEventClick={setSelectedEvent}
                />
              )}
            </>
          )}
        </div>
      </main>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

// ── Public export: resolves auth, then mounts CalendarInner ─────────────────
export function CalendarView() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return <LogoLoader label="Loading calendar…" />;
  if (!user) return null;

  return <CalendarInner user={user} />;
}