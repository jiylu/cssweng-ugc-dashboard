import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerInput } from "@/src/components/molecules/date-picker-input"
import { Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Deliverable } from "@/src/features/creator/proposals/types/deliverables.types"
import { adjustPriceValue } from "@/src/features/creator/proposals/utils/formatPrice"
import { ContentTypeSelect } from "@/src/features/creator/proposals/components/deliverables/content-type-select"

interface DeliverableRowProps {
  item: Deliverable
  index: number
  campaignStartDate: string
  campaignEndDate: string
  deliverablesCount: number
  currency: string
  errors: Record<string, string>
  canRemove: boolean
  platformOptions: string[]
  onUpdate: (field: keyof Deliverable, value: string) => void
  onRemove: () => void
}

function parseCalendarDate(value: string): Date | undefined {
  const [year, month, day] = value.split("T")[0].split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function DeliverableRow({ item, index, campaignStartDate, campaignEndDate, deliverablesCount, currency, errors, canRemove, platformOptions, onUpdate, onRemove }: DeliverableRowProps) {
  const e = (field: string) => errors[`deliverables.${index}.${field}`]
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const campaignStart = parseCalendarDate(campaignStartDate)
  const minimumDate = campaignStart && campaignStart > today ? campaignStart : today
  const maximumDate = parseCalendarDate(campaignEndDate)

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="bg-[#F2F0EA] border border-border rounded-[3px] p-3 flex flex-row flex-1 gap-2">
        {/* Left side */}
        <div className="flex flex-col gap-1 flex-1 min-w-0 self-stretch">
          {/* Top row - Quantity, Type, Content Type, Delete */}
          <div className="flex flex-wrap items-start gap-4 w-full">
            {/* Quantity */}
            <div className="flex flex-col gap-1 w-24 shrink-0">
              <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">QUANTITY<span className="text-[#ff6467] ml-1">*</span></label>
              <div className="flex items-center justify-between border border-border bg-white rounded-[3px] px-2 h-8">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = e.target.value
                    if (Number(val) < 1) return
                    onUpdate('quantity', val)
                  }}
                  className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="flex flex-col shrink-0">
                  <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => onUpdate('quantity', String(Number(item.quantity ?? 1) + 1))}
                  />
                  <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => onUpdate('quantity', String(Math.max(1, Number(item.quantity ?? 1) - 1)))}
                  />
                </div>
              </div>
              <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('quantity') ?? ""}</p>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1 w-40 shrink-0">
              <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">TYPE<span className="text-[#ff6467] ml-1">*</span></label>
              <Select value={item.deliverableType} onValueChange={(v) => onUpdate('deliverableType', v)}>
                <SelectTrigger className="text-sm bg-white border-border rounded-[3px]">
                  <SelectValue placeholder="Set type" />
                </SelectTrigger>
                <SelectContent className="p-1">
                  <SelectGroup className="p-0">
                    <SelectItem value="COLLABORATION" className="rounded-[3px]">Partnership</SelectItem>
                    <SelectItem value="UGC" className="rounded-[3px]">UGC</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('deliverableType') ?? ""}</p>
            </div>

            {/* Content Type */}
            <div className="flex-1 min-w-[200px]">
              <ContentTypeSelect
                platform={item.platform ?? ""}
                contentType={item.contentType ?? ""}
                platformOptions={platformOptions}
                onPlatformChange={(v) => onUpdate('platform', v)}
                onContentTypeChange={(v) => onUpdate('contentType', v)}
                platformError={e('platform')}
                contentTypeError={e('contentType')}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-1 flex-1 min-h-0">
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">REQUIREMENTS<span className="text-[#ff6467] ml-1">*</span></label>
            <div className="relative flex-1 flex flex-col h-full"> 
              <Textarea
              value={item.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              placeholder="Indicate requirements and format of the deliverable"
              className="w-full flex-1 !h-full [field-sizing:fixed] bg-white border border-border rounded-[3px] text-sm text-foreground placeholder:text-muted-foreground placeholder:italic resize-none break-words overflow-hidden"
              />
              <span className="absolute bottom-3 right-3 text-[13px] text-gray-400">
                {item.description?.length || 0}
              </span>
            </div>  
            <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('description') ?? ""}</p>
          </div>
        </div>

        {/* Right side - Scheduling & Pricing */}
        <div className="w-52 shrink-0 bg-white border border-border rounded-[3px] p-4 flex flex-col gap-1">
          <p className="text-sm font-medium text-[#6b1fa8] uppercase tracking-[0.03em]">Scheduling & Pricing</p>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground mt-2">DRAFT DUE DATE<span className="text-[#ff6467] ml-1">*</span></label>
            <DatePickerInput
              value={item.draftDeadline}
              onChange={(iso) => onUpdate('draftDeadline', iso)}
              minDate={minimumDate}
              maxDate={maximumDate}
            />
            <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('draftDeadline') ?? ""}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">POST DATE<span className="text-[#ff6467] ml-1">*</span></label>
            <DatePickerInput
              value={item.postDate ?? ""}
              onChange={(iso) => onUpdate('postDate', iso)}
              minDate={minimumDate}
              maxDate={maximumDate}
            />
            <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('postDate') ?? ""}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">PRICE<span className="text-[#ff6467] ml-1">*</span></label>
            <div className="flex items-center gap-1 border border-border rounded-[3px] px-2 h-8">
              <InputGroup className="border-0 flex-1 focus-within:!ring-0 focus-within:!border-transparent focus-within:!outline-none">
                <InputGroupAddon className="bg-transparent border-0 pl-1 pr-1 text-muted-foreground">{currency}</InputGroupAddon>
                <InputGroupInput
                  placeholder="Set a price"
                  className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0"
                  value={item.pricing}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '')
                    const parts = val.split('.')
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    onUpdate('pricing', parts.slice(0, 2).join('.'))
                  }}
                />
                
              </InputGroup>
              <div className="flex flex-col shrink-0">
                <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]"
                  onClick={() => onUpdate('pricing', adjustPriceValue(item.pricing, 1000))}
                />
                <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]"
                  onClick={() => onUpdate('pricing', adjustPriceValue(item.pricing, -1000))}
                />
              </div>
            </div>
            <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('pricing') ?? ""}</p>
          </div>
        </div>  
      </div>

      {/* Delete button */}
        {canRemove && (
          <div className="!flex flex-wrap items-start gap-0">
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Delete deliverable ${index + 1}`}
              className="px-0 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
    </div>
  )
}
