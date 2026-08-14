import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerInput } from "@/src/components/molecules/date-picker-input";
import { PlatformsCheckbox } from "@/src/features/creator/proposals/components/campaign-details/platforms-checkbox";
import { PlatformEntry } from "@/src/features/creator/proposals/types/campaign-setup.types"
import { CurrencySelect } from "@/src/features/creator/proposals/components/campaign-details/currency-select"
import { Separator } from "@/components/ui/separator"

export interface CampaignDetailsFormProps {
  form: {
    projectName: string
    setProjectName: (v: string) => void
    startDate: string
    setStartDate: (v: string) => void
    endDate: string
    setEndDate: (v: string) => void
    campaignDescription: string
    setCampaignDescription: (v: string) => void
    errors: Record<string, string>
    platforms: PlatformEntry[]
    setPlatforms: (v: PlatformEntry[]) => void
    currency: string
    setCurrency: (v: string) => void
  }
}

export default function CampaignDetailsSection({ form }: CampaignDetailsFormProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-")

  const acceptCurrentOrFutureDate = (iso: string, setDate: (value: string) => void) => {
    if (!iso || iso.slice(0, 10) >= todayKey) setDate(iso)
  }

  return (
    <div className="bg-white border border-border rounded p-5.5 flex flex-col gap-6 transition-[border-color,box-shadow] duration-300">
      <h2 className="text-[26px] font-normal text-foreground">Campaign Details</h2>
      <Separator className="-mt-4 mb-2"/>

      <p className="text-[16px] text-muted-foreground leading-relaxed -mt-4">
        Provide the core information, timeline, and an overview of this collaboration.
      </p>

      {/* Campaign Name */}
      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">
          CAMPAIGN NAME<span className="text-[#ff6467] ml-1">*</span>
        </label>
        <Input
          value={form.projectName}
          onChange={(e) => form.setProjectName(e.target.value)}
          type="text"
          className="border-muted"
          placeholder="Enter campaign name"
        />
        {form.errors.projectName && (
          <p className="text-xs mt-1 text-[#ff6467]">{form.errors.projectName}</p>
        )}
      </div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-0">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN START DATE<span className="text-[#ff6467] ml-1">*</span></label>
          <DatePickerInput
            value={form.startDate}
            onChange={(iso) => acceptCurrentOrFutureDate(iso, form.setStartDate)}
            minDate={today}
          />
          {form.errors.startDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.startDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-0">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN END DATE<span className="text-[#ff6467] ml-1">*</span></label>
          <DatePickerInput  
            value={form.endDate}
            onChange={(iso) => acceptCurrentOrFutureDate(iso, form.setEndDate)}
            minDate={today}
          />
          {form.errors.endDate && (
            <p className="text-xs mt-1 text-[#ff6467]">{form.errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Currency */}
      <CurrencySelect
        value={form.currency}
        onChange={form.setCurrency}
        error={form.errors.currency}
      />

      {/* Platforms */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PLATFORMS<span className="text-[#ff6467] ml-1">*</span></label>
        <PlatformsCheckbox
          value={form.platforms}
          onChange={form.setPlatforms}
          errors={form.errors}
        />
        {form.errors.platforms && <p className="text-xs mt-1 text-[#ff6467]">{form.errors.platforms}</p>}
      </div>

      {/* Campaign Description */}
      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">CAMPAIGN DESCRIPTION<span className="text-[#ff6467] ml-1">*</span></label>
          <div className="relative"> 
            <Textarea
              value={form.campaignDescription}
              onChange={(e) => form.setCampaignDescription(e.target.value)}
              className="w-full min-h-[100px] border border-muted bg-transparent p-3 text-sm placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:text-foreground resize-none"
              placeholder="Enter campaign description"
            />
            <span className="absolute bottom-3 right-3 text-[13px] text-gray-400">
              {form.campaignDescription?.length || 0}
            </span>
          </div>  
            {form.errors.campaignDescription && (
              <p className="text-xs mt-1 text-[#ff6467]">{form.errors.campaignDescription}</p>
            )}
      </div>
    </div>
  )
}
