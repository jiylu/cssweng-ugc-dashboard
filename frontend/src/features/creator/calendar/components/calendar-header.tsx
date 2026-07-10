"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { startOfWeek, endOfWeek, format } from "date-fns";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CalendarHeaderProps {
  currentDate: Date;
  /** Navigate backward by one period (month/week/day depending on active view). */
  onPrev: () => void;
  /** Navigate forward by one period. */
  onNext: () => void;
  onDateChange: (date: Date) => void;
  view: "month" | "week" | "day";
  setView: (view: "month" | "week" | "day") => void;
}

const VIEWS = ["month", "week", "day"] as const;

const MONTH_ABBREVS = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun",
  "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec",
] as const;

// ── MonthYearPicker (popover) ─────────────────────────────────────────────────

interface MonthYearPickerProps {
  currentDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

function MonthYearPicker({ currentDate, onSelect, onClose }: MonthYearPickerProps) {
  const [draftYear, setDraftYear] = useState(currentDate.getFullYear());
  const activeMonth = currentDate.getMonth();
  const activeYear  = currentDate.getFullYear();

  return (
    <div className="p-3 w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setDraftYear((y) => y - 1)}
          aria-label="Previous year"
          className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-[#D8D4CB] text-[#78746E] hover:text-[#141518] hover:bg-[#E8E4DC] transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-semibold text-[#141518] tabular-nums">{draftYear}</span>
        <button
          type="button"
          onClick={() => setDraftYear((y) => y + 1)}
          aria-label="Next year"
          className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-[#D8D4CB] text-[#78746E] hover:text-[#141518] hover:bg-[#E8E4DC] transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {MONTH_ABBREVS.map((abbrev, idx) => {
          const isActive = idx === activeMonth && draftYear === activeYear;
          return (
            <button
              key={abbrev}
              type="button"
              onClick={() => { onSelect(new Date(draftYear, idx, 1)); onClose(); }}
              className={[
                "py-1.5 text-xs font-medium text-center rounded-[2px] transition-colors",
                isActive ? "bg-[#6B1FA8] text-white" : "text-[#141518] hover:bg-[#E8E4DC]",
              ].join(" ")}
            >
              {abbrev}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Period label helpers ───────────────────────────────────────────────────────

function buildPeriodLabel(date: Date, view: "month" | "week" | "day"): string {
  if (view === "month") {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }
  if (view === "week") {
    const wStart = startOfWeek(date, { weekStartsOn: 0 });
    const wEnd   = endOfWeek(date,   { weekStartsOn: 0 });
    // Same month → "Jun 29 – Jul 5, 2026" | same year → "Jun 29 – Jul 5, 2026"
    if (wStart.getMonth() === wEnd.getMonth()) {
      return `${format(wStart, "MMM d")} – ${format(wEnd, "d, yyyy")}`;
    }
    if (wStart.getFullYear() === wEnd.getFullYear()) {
      return `${format(wStart, "MMM d")} – ${format(wEnd, "MMM d, yyyy")}`;
    }
    return `${format(wStart, "MMM d, yyyy")} – ${format(wEnd, "MMM d, yyyy")}`;
  }
  // day view
  return format(date, "EEEE, MMMM d, yyyy");
}

// ── CalendarHeader ─────────────────────────────────────────────────────────────

export function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onDateChange,
  view,
  setView,
}: CalendarHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const periodLabel = buildPeriodLabel(currentDate, view);

  // The month/year picker is only meaningful in month view.
  // In week / day we still show the label but disable the picker trigger.
  const pickerEnabled = view === "month";

  return (
    <div className="flex items-center justify-between w-full mb-6">
      {/* Left: period selector + prev/next arrows */}
      <div className="flex items-center gap-1.5">
        <Popover
          open={pickerEnabled ? pickerOpen : false}
          onOpenChange={pickerEnabled ? setPickerOpen : undefined}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={!pickerEnabled}
              aria-label="Open month and year picker"
              aria-expanded={pickerOpen}
              className={[
                "h-9 flex items-center justify-between px-3 bg-[#F2F0EA] border border-[#D8D4CB] rounded-[4px] text-sm font-medium text-[#141518] transition-colors",
                pickerEnabled
                  ? "hover:bg-[#E8E4DC] cursor-pointer w-[190px]"
                  : "cursor-default w-auto min-w-[190px] max-w-[340px] opacity-90",
              ].join(" ")}
            >
              <span className="truncate">{periodLabel}</span>
              {pickerEnabled && (
                <ChevronDown
                  className={[
                    "h-3.5 w-3.5 text-[#78746E] shrink-0 ml-2 transition-transform duration-150",
                    pickerOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              )}
            </button>
          </PopoverTrigger>
          {pickerEnabled && (
            <PopoverContent
              align="start"
              sideOffset={6}
              className="p-0 w-auto rounded-[4px] border border-[#D8D4CB] bg-white shadow-md"
            >
              <MonthYearPicker
                currentDate={currentDate}
                onSelect={onDateChange}
                onClose={() => setPickerOpen(false)}
              />
            </PopoverContent>
          )}
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          aria-label="Previous period"
          className="h-9 w-9 bg-[#F2F0EA] border-[#D8D4CB] rounded-[2px] hover:bg-[#E8E4DC]"
        >
          <ChevronLeft className="h-4 w-4 text-[#141518]" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          aria-label="Next period"
          className="h-9 w-9 bg-[#F2F0EA] border-[#D8D4CB] rounded-[2px] hover:bg-[#E8E4DC]"
        >
          <ChevronRight className="h-4 w-4 text-[#141518]" />
        </Button>
      </div>

      {/* Right: view-mode tab group */}
      <div className="flex border border-[#D8D4CB] rounded-[4px] overflow-hidden bg-[#F2F0EA]">
        {VIEWS.map((v) => (
          <Button
            key={v}
            variant="ghost"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={[
              "rounded-none px-5 h-9 capitalize text-sm transition-colors",
              view === v
                ? "bg-[#D8D4CB] text-[#141518] font-semibold"
                : "text-[#78746E] hover:bg-[#EAE6DF] hover:text-[#141518]",
            ].join(" ")}
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  );
}