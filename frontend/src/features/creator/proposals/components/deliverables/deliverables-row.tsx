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
  deliverablesCount: number
  currency: string
  errors: Record<string, string>
  onUpdate: (field: keyof Deliverable, value: string) => void
  onRemove: () => void
}

export function DeliverableRow({ item, index, deliverablesCount, currency, errors, onUpdate, onRemove }: DeliverableRowProps) {
  const e = (field: string) => errors[`deliverables.${index}.${field}`]

  return (
    <div className="bg-[#F2F0EA] border border-border rounded-[3px] p-2 flex flex-row gap-2">
      {/* Left side */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Top row - Quantity, Type, Content Type, Delete */}
        <div className="flex flex-wrap items-start gap-4 w-full">
          {/* Quantity */}
          <div className="flex flex-col gap-1 w-24 shrink-0">
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">QUANTITY</label>
            <div className="flex items-center justify-between border border-border bg-white rounded-[3px] px-2 py-1">
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
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">TYPE</label>
            <Select value={item.deliverableType} onValueChange={(v) => onUpdate('deliverableType', v)}>
              <SelectTrigger className="text-sm bg-white border-border rounded-[3px]">
                <SelectValue placeholder="Set type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="COLLABORATION">Partnership</SelectItem>
                  <SelectItem value="UGC">UGC</SelectItem>
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
              onPlatformChange={(v) => onUpdate('platform', v)}
              onContentTypeChange={(v) => onUpdate('contentType', v)}
              platformError={e('platform')}
              contentTypeError={e('contentType')}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">REQUIREMENTS</label>
          <Textarea
            value={item.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Indicate requirements and format of the deliverable"
            className="w-full min-h-[160px] bg-white border border-border rounded-[3px] text-sm text-foreground placeholder:text-muted-foreground placeholder:italic resize-none break-words overflow-hidden"
          />
          <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('description') ?? ""}</p>
        </div>
      </div>

      {/* Right side - Scheduling & Pricing */}
      <div className="w-52 shrink-0 bg-white border border-border rounded-[3px] p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-[#6b1fa8] uppercase tracking-[0.03em]">Scheduling & Pricing</p>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Draft Due Date</label>
          <DatePickerInput
            value={item.draftDeadline}
            onChange={(iso) => onUpdate('draftDeadline', iso)}
          />
          <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('draftDeadline') ?? ""}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Post Date</label>
          <DatePickerInput
            value={item.postDate ?? ""}
            onChange={(iso) => onUpdate('postDate', iso)}
          />
          <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{e('postDate') ?? ""}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Price</label>
          <div className="flex items-center gap-1 border border-border rounded-[3px] px-2 py-1">
            <InputGroup className="border-0 flex-1">
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
              <InputGroupAddon>{currency}</InputGroupAddon>
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
      {/* Delete button */}
      { deliverablesCount > 1 &&  
        <div className="!flex flex-wrap items-start gap-0">
          <button
            type="button"
            onClick={onRemove}
            className="px-0 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      }
    </div>
  )
}