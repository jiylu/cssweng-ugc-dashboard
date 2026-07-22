import React from "react";
import { CalendarEvent } from "../types/calendar.types";
import { Megaphone, ClipboardCheck, Send } from "lucide-react";

interface EventChipProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  /**
   * compact — strips the icon and uses tighter padding.
   * Use in the month-grid cells where horizontal space is tight.
   * Default: false (icon shown).
   */
  compact?: boolean;
  /**
   * dateRole — visual role for CAMPAIGN_DURATION chips.
   * 'start' = bright purple, 'end' = red-orange, 'middle' = muted.
   */
  dateRole?: 'start' | 'end' | 'middle';
}

const EVENT_CONFIG = {
  CAMPAIGN_DURATION: { bg: "bg-[#6B1FA8]", hover: "hover:bg-[#5a1890]", Icon: Megaphone },
  DELIVERABLE_DUE:   { bg: "bg-[#C85A1A]", hover: "hover:bg-[#b04e16]", Icon: ClipboardCheck },
  DELIVERABLE_POST:  { bg: "bg-[#1F8A4A]", hover: "hover:bg-[#1a7440]", Icon: Send },
} as const;

const CAMPAIGN_DATE_COLORS = {
  start:  { bg: "bg-[#6B1FA8]", hover: "hover:bg-[#5a1890]" },
  end:    { bg: "bg-[#C85A1A]", hover: "hover:bg-[#b04e16]" },
  middle: { bg: "bg-[#A78BDA]", hover: "hover:bg-[#9577cc]" },
} as const;

export function EventChip({ event, onClick, compact = false, dateRole }: EventChipProps) {
  const base = EVENT_CONFIG[event.type];
  const colors =
    event.type === "CAMPAIGN_DURATION" && dateRole
      ? CAMPAIGN_DATE_COLORS[dateRole]
      : base;
  const { bg, hover } = colors;
  const { Icon } = base;

  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      title={event.title}
      className={[
        bg, hover,
        "w-full text-left flex items-center gap-1 rounded-[2px] text-[10px] font-medium text-white transition-colors duration-150 cursor-pointer select-none",
        compact ? "px-1 py-0.5" : "px-1.5 py-0.5",
      ].join(" ")}
    >
      {!compact && <Icon className="h-2.5 w-2.5 shrink-0" />}
      <span className="truncate leading-tight">{event.title}</span>
    </button>
  );
}
