import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { Megaphone, ClipboardCheck, Send } from "lucide-react";

interface EventChipProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

const EVENT_CONFIG = {
  CAMPAIGN_DURATION: { bg: "bg-[#6B1FA8]", hover: "hover:bg-[#5a1890]", Icon: Megaphone },
  DELIVERABLE_DUE:   { bg: "bg-[#C85A1A]", hover: "hover:bg-[#b04e16]", Icon: ClipboardCheck },
  DELIVERABLE_POST:  { bg: "bg-[#1F8A4A]", hover: "hover:bg-[#1a7440]", Icon: Send },
} as const;

export function EventChip({ event, onClick }: EventChipProps) {
  const { bg, hover, Icon } = EVENT_CONFIG[event.type];

  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      title={event.title}
      className={`${bg} ${hover} w-full text-left flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-medium text-white transition-colors duration-150 cursor-pointer select-none`}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" />
      <span className="truncate leading-tight">{event.title}</span>
    </button>
  );
}
