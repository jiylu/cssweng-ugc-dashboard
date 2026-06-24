import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerInput } from "@/src/components/molecules/date-picker-input";

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
}

export default function CampaignDetailsSection({ form }: CampaignDetailsFormProps) {
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
          <DatePickerInput
            value={form.startDate}
            onChange={(iso) => form.setStartDate(iso)}
          />
          {form.errors.startDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.startDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-0">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN END DATE</label>
          <DatePickerInput
            value={form.endDate}
            onChange={(iso) => form.setEndDate(iso)}
          />
          {form.errors.endDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Campaign Description */}
      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN DESCRIPTION</label>
        <Textarea
          value={form.campaignDescription}
          onChange={(e) => form.setCampaignDescription(e.target.value)}
          className="w-full min-h-[100px] border border-muted-foreground bg-transparent p-3 text-sm text-muted-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:text-foreground resize-none"
          placeholder="Enter Description"
        />
        {form.errors.campaignDescription && (
          <p className="text-xs mt-1 text-[#ff6467]">{form.errors.campaignDescription}</p>
        )}
      </div>
    </div>
  )
}