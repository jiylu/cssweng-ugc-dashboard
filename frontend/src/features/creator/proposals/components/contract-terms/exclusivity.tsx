import { Card } from "@/src/components/atoms/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DatePickerInput } from "@/src/components/molecules/date-picker-input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ChevronUp, ChevronDown } from "lucide-react"
import { adjustPriceValue } from "@/src/features/creator/proposals/utils/formatPrice"

interface ExclusivityProps {
  hasExclusivity: boolean
  setHasExclusivity: (v: boolean) => void
  exclusivityCategory: string
  setExclusivityCategory: (v: string) => void
  exclusivityCompetitorList: string
  setExclusivityCompetitorList: (v: string) => void
  exclusivityStartDate: string
  setExclusivityStartDate: (v: string) => void
  exclusivityEndDate: string
  setExclusivityEndDate: (v: string) => void
  exclusivityFee: string
  setExclusivityFee: (v: string) => void
  exclusivityTerritory: string
  setExclusivityTerritory: (v: string) => void
  errors: Record<string, string>
}

export function Exclusivity({ 
                              hasExclusivity, setHasExclusivity, 
                              exclusivityCategory, setExclusivityCategory, 
                              exclusivityCompetitorList, setExclusivityCompetitorList, 
                              exclusivityStartDate, setExclusivityStartDate, 
                              exclusivityEndDate, setExclusivityEndDate, 
                              exclusivityFee, setExclusivityFee, 
                              exclusivityTerritory, setExclusivityTerritory, 
                              errors }: ExclusivityProps) 
                            {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-normal text-foreground">Exclusivity</h2>
          <span className="text-sm text-muted-foreground italic">No exclusivity applies unless details are provided.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Has exclusivity?</span>
          <Switch checked={hasExclusivity} onCheckedChange={setHasExclusivity} />
        </div>
      </div>

      <Separator />

      {hasExclusivity && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">CATEGORY</label>
              <Input
                value={exclusivityCategory}
                onChange={(e) => setExclusivityCategory(e.target.value)}
                placeholder="Enter category"
                className="border-border rounded-[3px] text-sm"
              />
              {errors.exclusivityCategory && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityCategory}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">COMPETITOR LIST</label>
              <Input
                value={exclusivityCompetitorList}
                onChange={(e) => setExclusivityCompetitorList(e.target.value)}
                placeholder="Brand A, Brand B"
                className="border-border rounded-[3px] text-sm"
              />
              {errors.exclusivityCompetitorList && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityCompetitorList}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">START DATE</label>
              <DatePickerInput value={exclusivityStartDate} onChange={setExclusivityStartDate} placeholder="Set exclusivity start date" />
              {errors.exclusivityStartDate && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityStartDate}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">END DATE</label>
              <DatePickerInput value={exclusivityEndDate} onChange={setExclusivityEndDate} placeholder="Set exclusivity end date" />
              {errors.exclusivityEndDate && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityEndDate}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">EXCLUSIVITY FEE</label>
              <div className="flex items-center gap-1">
                <InputGroup className="border border-border rounded-[3px]">
                  <InputGroupInput
                    value={exclusivityFee}
                    placeholder="0"
                    className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2"
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '')
                      const parts = val.split('.')
                      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      setExclusivityFee(parts.slice(0, 2).join('.'))
                    }}
                  />
                  <InputGroupAddon>PHP</InputGroupAddon>
                </InputGroup>
                <div className="flex flex-col shrink-0">
                  <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" 
                    onClick={() => setExclusivityFee(adjustPriceValue(exclusivityFee, 1000))}
                  />
                  <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" 
                    onClick={() => setExclusivityFee(adjustPriceValue(exclusivityFee, -1000))} 
                  />
                </div>
                {errors.exclusivityFee && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityFee}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">TERRITORY</label>
            <Input
              value={exclusivityTerritory}
              onChange={(e) => setExclusivityTerritory(e.target.value)}
              placeholder="Enter territory"
              className="border-border rounded-[3px] text-sm w-1/2"
            />
            {errors.exclusivityTerritory && <p className="text-xs mt-1 text-[#ff6467]">{errors.exclusivityTerritory}</p>}
          </div>
        </div>
      )}
    </Card>
  )
}