"use client";

import React, { useEffect } from "react";
import { CalendarEvent } from "../types/calendar.types";
import { X, ClipboardCheck, Send, CalendarDays, Tag, FileText, Layers, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

const TYPE_CONFIG = {
  DELIVERABLE_DUE: {
    label: "Due Date",
    Icon: ClipboardCheck,
    accentBg: "bg-[#B8860B]",
    badgeBg: "bg-[#FFF8E1]",
    badgeText: "text-[#B8860B]",
  },
  DELIVERABLE_POST: {
    label: "Post Date",
    Icon: Send,
    accentBg: "bg-[#1F8A4A]",
    badgeBg: "bg-[#E8FFF0]",
    badgeText: "text-[#1F8A4A]",
  },
} as const;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:        "bg-[#E8FFF0] text-[#1F8A4A]",
  COMPLETED:     "bg-[#141518] text-white",
  PENDING:       "bg-[#D8D4CB] text-[#141518]",
  FOR_REVISIONS: "bg-[#FFF3E8] text-[#C85A1A]",
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#78746E]" />
      <div className="min-w-0">
        <p className="text-[10px] text-[#78746E] uppercase tracking-wider font-medium">{label}</p>
        <p className="text-xs text-[#141518] font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const config = TYPE_CONFIG[event.type];
  const { Icon } = config;
  const statusStyle = event.status
    ? (STATUS_STYLES[event.status] ?? "bg-[#D8D4CB] text-[#141518]")
    : null;
  const d = event.deliverable;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Deliverable detail: ${event.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#D8D4CB] rounded-[4px] shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${config.accentBg} h-1 w-full`} />

        <div className="p-5">
          {/* Badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-[2px] ${config.badgeBg} ${config.badgeText}`}>
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
              {event.status && statusStyle && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-[2px] ${statusStyle}`}>
                  <Tag className="h-3 w-3" />
                  {event.status}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
              className="h-7 w-7 rounded-[2px] text-[#78746E] hover:text-[#141518] hover:bg-[#F2F0EA] shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Campaign name */}
          {event.campaignName && (
            <p className="text-[11px] text-[#78746E] font-medium mb-1">{event.campaignName}</p>
          )}

          {/* Deliverable content */}
          <h3 className="text-base font-semibold text-[#141518] leading-snug mb-4">
            {d?.deliverable_content ?? event.title}
          </h3>

          {/* Info rows */}
          <div className="flex flex-col gap-3 text-sm text-[#78746E]">
            {d?.due_date && (
              <InfoRow
                icon={CalendarDays}
                label="Due Date"
                value={format(new Date(d.due_date), "MMMM d, yyyy")}
              />
            )}
            {d?.post_date && (
              <InfoRow
                icon={CalendarDays}
                label="Post Date"
                value={format(new Date(d.post_date), "MMMM d, yyyy")}
              />
            )}

            {d?.requirements && (
              <InfoRow icon={FileText} label="Requirements" value={d.requirements} />
            )}

            {d?.deliverable_type && (
              <InfoRow icon={Layers} label="Type" value={d.deliverable_type === "UGC" ? "UGC" : "Collaboration"} />
            )}

            {d?.quantity != null && (
              <InfoRow icon={Layers} label="Quantity" value={String(d.quantity)} />
            )}

            {d?.pricing != null && (
              <InfoRow
                icon={DollarSign}
                label="Pricing"
                value={`${Number(d.pricing).toFixed(2)} ${event.campaignCurrency ?? ""}`}
              />
            )}
          </div>

          {/* Close */}
          <div className="border-t border-[#D8D4CB] mt-4 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full rounded-[2px] border-[#D8D4CB] text-[#141518] text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
