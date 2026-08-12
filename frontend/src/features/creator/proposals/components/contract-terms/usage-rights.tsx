import { Card } from "@/src/components/atoms/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown } from "lucide-react"

interface UsageRightsProps {
  includedOrganicUsage: string
  setIncludedOrganicUsage: (v: string) => void
  territory: string
  setTerritory: (v: string) => void
  restrictions: string
  setRestrictions: (v: string) => void
  contentRetention: number
  setContentRetention: (v: number) => void
  partnershipTags: string
  setPartnershipTags: (v: string) => void
  errors: Record<string, string>
}

export function UsageRights({ 
                              includedOrganicUsage, setIncludedOrganicUsage, 
                              territory, setTerritory, 
                              restrictions, setRestrictions, 
                              contentRetention, setContentRetention, 
                              partnershipTags, setPartnershipTags, 
                              errors }: UsageRightsProps) 
                            {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Usage Rights and Ownership */}
      <Card className="col-span-2 flex flex-col gap-4">
        <h2 className="text-2xl font-normal text-foreground">Usage Rights and Ownership</h2>
        <Separator />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">INCLUDED ORGANIC USAGE</label>
          <Textarea
            value={includedOrganicUsage}
            onChange={(e) => setIncludedOrganicUsage(e.target.value)}
            placeholder="Brand may repost on owned organic social channels with credit for 8 months..."
            className="resize-none min-h-[80px] border border-border rounded-[3px] text-sm bg-transparent"
          />
          {errors.includedOrganicUsage && <p className="text-xs mt-1 text-[#ff6467]">{errors.includedOrganicUsage}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">TERRITORY</label>
            <Input
              value={territory}
              onChange={(e) => setTerritory(e.target.value)}
              placeholder="Enter territory"
              className="border-border rounded-[3px] text-sm"
            />
            {errors.territory && <p className="text-xs mt-1 text-[#ff6467]">{errors.territory}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">RESTRICTIONS</label>
            <Input
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="Enter restrictions"
              className="border-border rounded-[3px] text-sm"
            />
            {errors.restrictions && <p className="text-xs mt-1 text-[#ff6467]">{errors.restrictions}</p>}
          </div>
        </div>
      </Card>

      {/* Posting Requirements */}
      <Card className="flex flex-col gap-4">
        <h2 className="text-2xl font-normal text-foreground">Posting Requirements</h2>
        <Separator />

        {/* Content Retention */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">CONTENT RETENTION</label>
          <div className="flex items-center gap-2">
            <InputGroup className="border border-border p-1 rounded-[3px] bg-white w-full">
              <InputGroupInput
                type="number"
                value={contentRetention}
                onChange={(e) => setContentRetention(Math.max(1, Number(e.target.value)))}
                className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <InputGroupAddon align="inline-end">MONTHS</InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <div className="flex flex-col shrink-0 px-1.5">
                  <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setContentRetention(contentRetention + 1)} />
                  <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setContentRetention(Math.max(1, contentRetention - 1))} />
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <span className="text-xs text-muted-foreground mt-1 italic">Posts must remain live for the duration</span>
          {errors.contentRetention && <p className="text-xs mt-1 text-[#ff6467]">{errors.contentRetention}</p>}
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">PARTNERSHIP TAGS</label>
          <Input
            value={partnershipTags}
            onChange={(e) => setPartnershipTags(e.target.value)}
            placeholder="e.g., #ad, #partnership, #sponsored"
            className="border-border rounded-[3px] text-sm"
          />
          
          <span className="text-xs text-muted-foreground mt-1 italic">Social media tags to be used in the content</span>
          {errors.partnershipTags && <p className="text-xs mt-1 text-[#ff6467]">{errors.partnershipTags}</p>}
        </div>
      </Card>
    </div>
  )
}