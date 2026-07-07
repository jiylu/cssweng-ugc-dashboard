"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
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

interface MonthYearPickerProps {
  currentDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

function MonthYearPicker({ currentDate, onSelect, onClose }: MonthYearPickerProps) {
  const [draftYear, setDraftYear] = useState(currentDate.getFullYear());
  const activeMonth = currentDate.getMonth();
  const activeYear = currentDate.getFullYear();

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

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onDateChange,
  view,
  setView,
}: CalendarHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between w-full mb-6">
      <div className="flex items-center gap-1.5">
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Open month and year picker"
              aria-expanded={pickerOpen}
              className="h-9 w-[190px] flex items-center justify-between px-3 bg-[#F2F0EA] border border-[#D8D4CB] rounded-[4px] text-sm font-medium text-[#141518] hover:bg-[#E8E4DC] transition-colors cursor-pointer"
            >
              <span className="truncate">{monthLabel}</span>
              <ChevronDown className={[
                "h-3.5 w-3.5 text-[#78746E] shrink-0 ml-2 transition-transform duration-150",
                pickerOpen ? "rotate-180" : "",
              ].join(" ")} />
            </button>
          </PopoverTrigger>
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
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={onPrevMonth}
          aria-label="Previous period"
          className="h-9 w-9 bg-[#F2F0EA] border-[#D8D4CB] rounded-[2px] hover:bg-[#E8E4DC]"
        >
          <ChevronLeft className="h-4 w-4 text-[#141518]" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="Next period"
          className="h-9 w-9 bg-[#F2F0EA] border-[#D8D4CB] rounded-[2px] hover:bg-[#E8E4DC]"
        >
          <ChevronRight className="h-4 w-4 text-[#141518]" />
        </Button>
      </div>

      <h2 className="text-4xl font-light text-[#141518] tracking-tight">Calendar</h2>

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