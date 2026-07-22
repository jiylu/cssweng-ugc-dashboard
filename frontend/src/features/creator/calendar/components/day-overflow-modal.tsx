"use client";

import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { EventChip } from "./event-chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { getCampaignDateRole } from "../calendar.utils";

interface DayOverflowModalProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onClose: () => void;
}

export function DayOverflowModal({ date, events, onEventClick, onClose }: DayOverflowModalProps) {
  function handleEventClick(event: CalendarEvent) {
    onClose();
    onEventClick(event);
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-[#D8D4CB]">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-[#141518]">
            <CalendarDays className="h-4 w-4 text-[#6B1FA8] shrink-0" />
            {format(date, "EEEE, MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78746E]">
            {events.length} event{events.length !== 1 ? "s" : ""} scheduled
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 p-4 max-h-[400px] overflow-y-auto">
          {events.map((event) => (
            <EventChip
              key={event.id}
              event={event}
              onClick={handleEventClick}
              dateRole={getCampaignDateRole(event, date) ?? undefined}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
