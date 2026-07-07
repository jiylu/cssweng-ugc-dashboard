import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerInput } from "@/src/components/molecules/date-picker-input"
import { Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Deliverable } from "@/src/features/creator/proposals/types/deliverables.types"
import { adjustPriceValue } from "@/src/features/creator/proposals/utils/formatPrice"

interface DeliverableRowProps {
  item: Deliverable
  index: number
  errors: Record<string, string>
  onUpdate: (field: keyof Deliverable, value: string) => void
  onRemove: () => void
}

export function DeliverableRow({ item, index, errors, onUpdate, onRemove }: DeliverableRowProps) {
  const e = (field: string) => errors[`deliverables.${index}.${field}`]

  return (
    <div className="bg-[#F2F0EA] border border-border rounded-[3px] p-5 flex flex-col gap-4 relative">
      {/* Delete button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 size={16} />
      </button>

      {/* Top row - Quantity, Type, Content Type */}
      <div className="flex flex-wrap items-end gap-4 w-full pr-6">
        {/* Quantity */}
        <div className="flex flex-col gap-1 w-24 shrink-0">
          <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">QUANTITY</label>
          <div className="flex items-center justify-between border border-border bg-white rounded-[3px] px-2 py-1">
            <Input
              type="number"
              value={item.quantity ?? "1"}
              onChange={(e) => onUpdate('quantity', e.target.value)}
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
          {e('quantity') && <p className="text-xs mt-1 text-[#ff6467]">{e('quantity')}</p>}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1 w-40 shrink-0">
          <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">TYPE</label>
          <Select value={item.deliverableType} onValueChange={(v) => onUpdate('deliverableType', v)}>
            <SelectTrigger className="text-sm bg-white border-border rounded-[3px]">
              <SelectValue placeholder="Set Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="UGC">UGC</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {e('deliverableType') && <p className="text-xs mt-1 text-[#ff6467]">{e('deliverableType')}</p>}
        </div>

        {/* Content Type */}
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">CONTENT TYPE</label>
          <Select value={item.contentType ?? ""} onValueChange={(v) => onUpdate('contentType', v)}>
            <SelectTrigger className="text-sm bg-white border-border rounded-[3px]">
              <SelectValue placeholder="Set Platform/Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Youtube">Youtube</SelectItem>
                <SelectItem value="Tik Tok">Tik Tok</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {e('contentType') && <p className="text-xs mt-1 text-[#ff6467]">{e('contentType')}</p>}
        </div>
      </div>

      {/* Bottom row - Requirements + Scheduling & Pricing */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Requirements */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">REQUIREMENTS</label>
          <Textarea
            value={item.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Indicate requirements and format of the deliverable"
            className="w-full min-h-[160px] bg-white border border-border rounded-[3px] text-sm text-foreground placeholder:text-muted-foreground placeholder:italic resize-none break-words overflow-hidden"
          />
          {e('description') && <p className="text-xs mt-1 text-[#ff6467]">{e('description')}</p>}
        </div>

        {/* Scheduling & Pricing */}
        <div className="w-full lg:w-48 shrink-0 bg-white border border-border rounded-[3px] p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-[#6b1fa8] uppercase tracking-[0.03em]">Scheduling & Pricing</p>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Draft Due Date</label>
            <DatePickerInput
              value={item.draftDeadline}
              onChange={(iso) => onUpdate('draftDeadline', iso)}
            />
            {e('draftDeadline') && <p className="text-xs mt-1 text-[#ff6467]">{e('draftDeadline')}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Post Date</label>
            <DatePickerInput
              value={item.postDate ?? ""}
              onChange={(iso) => onUpdate('postDate', iso)}
            />
            {e('postDate') && <p className="text-xs mt-1 text-[#ff6467]">{e('postDate')}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Price</label>
            <div className="flex items-center gap-1 rounded-[3px] px-2 py-1">
              <InputGroup className="border border-border">
                <InputGroupInput
                  placeholder="0"
                  className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0"
                  value={item.pricing}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '')
                    const parts = val.split('.')
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    onUpdate('pricing', parts.slice(0, 2).join('.'))
                  }}
                />
                <InputGroupAddon>PHP</InputGroupAddon>
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
            {e('pricing') && <p className="text-xs mt-1 text-[#ff6467]">{e('pricing')}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}