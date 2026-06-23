import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface CampaignDetailsFormProps {
  form: {
    projectName: string;
    setProjectName: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
    endDate: string;
    setEndDate: (v: string) => void;
    campaignDescription: string;
    setCampaignDescription: (v: string) => void;
    errors: Record<string, string>;
  }

  refs: {
    startDateRef: React.RefObject<HTMLInputElement | null>;
    endDateRef: React.RefObject<HTMLInputElement | null>;
  }
}

export default function CampaignDetailsSection({ form, refs }: CampaignDetailsFormProps) {
  const { startDateRef, endDateRef } = refs

  const openStartDatePicker = () => {
    if (!startDateRef.current) return

    startDateRef.current.focus()

    try {
      startDateRef.current.showPicker()
    } catch (e) { }
  }

  const openEndDatePicker = () => {
    if (!endDateRef.current) return

    endDateRef.current.focus()

    try {
      endDateRef.current.showPicker()
    } catch (e) { }
  }

  // TODO: Fix the hover colors, refer to textarea className
  // TODO: Convert to shadcn components.
  return (
    <div className="bg-white border border-border rounded p-5.5 flex flex-col gap-6 transition-[border-color,box-shadow] duration-300">
      <h2 className="text-[26px] font-normal text-foreground">Campaign Details</h2>

      <p className="text-[16px] text-muted-foreground leading-relaxed -mt-4">
        Provide the core information, timeline, and an overview of this collaboration.
      </p>

      {/* Campaign Name */}
      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">
          CAMPAIGN NAME
        </label>

        <Input
          value={form.projectName}
          onChange={(e) => form.setProjectName(e.target.value)}
          type="text"
          className="w-full border-0 border-b border-border py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200"
          placeholder="Enter campaign name"
        />

        {form.errors.projectName && (
          <p className="text-xs mt-1 text-[#ff6467]">{form.errors.projectName}</p>
        )}
      </div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-0">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN START DATE</label>

          <div className="flex items-center gap-2 border-b border-border pb-1 relative transition-colors duration-200 focus-within:border-b-accent">
            <Calendar
              size={16}
              className="text-[#78746e] shrink-0 cursor-pointer relative z-20 mb-1"
              onClick={openStartDatePicker}
            />

            <Input
              ref={startDateRef}
              type="date"
              value={form.startDate}
              onChange={(e) => form.setStartDate(e.target.value)}
              data-empty={!form.startDate}
              className="w-full border-0 py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200 rounded-xs relative z-10 cursor-text [&::-webkit-calendar-picker-indicator]:hidden"
            />

            <span className="absolute left-6 text-[#78746e] italic text-sm pointer-events-none hidden">
              Set campaign start date
            </span>
          </div>

          {form.errors.startDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.startDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-0">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN END DATE</label>

          <div className="flex items-center gap-2 border-b border-border pb-1 relative transition-colors duration-200">
            <Calendar
              size={16}
              className="text-[#78746e] shrink-0 cursor-pointer relative z-20 mb-1"
              onClick={openEndDatePicker}
            />

            <Input
              ref={endDateRef}
              type="date"
              value={form.endDate}
              onChange={(e) => form.setEndDate(e.target.value)}
              data-empty={!form.endDate}
              className="w-full border-0 py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200 rounded-xs relative z-10 cursor-text [&::-webkit-calendar-picker-indicator]:hidden"
            />

            <span className="absolute left-6 text-[#78746e] italic text-sm pointer-events-none hidden">
              Set campaign end date
            </span>
          </div>
          {form.errors.endDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Campaign Description */}
      <div className={"flex flex-col gap-0"}>
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN DESCRIPTION</label>
        
        <Textarea
          value={form.campaignDescription}
          onChange={(e) => form.setCampaignDescription(e.target.value)}
          className="w-full min-h-25 resize-y border border-muted-foreground bg-transparent p-3 text-sm text-muted-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:text-foreground resize-none"
          placeholder="Enter Description"
        />

        {form.errors.campaignDescription && (
          <p className="text-xs mt-1 text-[#ff6467]">{form.errors.campaignDescription}</p>
        )}
      </div>
    </div>
  )
}