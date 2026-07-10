import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export type CurrencyEnum = "PHP" | "CAD" | "USD" | "EUR" | "GBP";

export interface AddOnRowProps {
    id: string
    index: number
    errors: Record<string, string>
    title: string
    desc: string
    fee?: number
    currency: CurrencyEnum
    onRemove?: () => void
    onAdjustPrice?: (amount: number) => void
    onTitleChange?: (value: string) => void
    onDescChange?: (value: string) => void
    onFeeChange?: (value: number) => void
}

export function AddOnRow({ id, index, errors, title, desc, fee, currency, onRemove, onAdjustPrice, onTitleChange, onDescChange, onFeeChange }: AddOnRowProps) {
    const e = (field: string) => errors?.[`addOns.${index}.${field}`]

    return (
        <div className="grid grid-cols-12 gap-4 py-4 px-6 -mx-6 border-b border-border items-start">
        
            {/* Name */}
            <div className="col-span-4">
                <Input 
                    name="title"
                    placeholder="Name"
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    className="w-full h-[40px] bg-white border border-border rounded-[3px] text-sm text-foreground shadow-none placeholder:italic"
                />
                {e('title') && <p className="text-xs mt-1 text-[#ff6467]">{e('title')}</p>}
            </div>

            {/* Description */}
            <div className="col-span-5">
                <Textarea 
                    name="description"
                    placeholder="Description"
                    defaultValue={desc}
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                    onChange={(e) => onDescChange?.(e.target.value)}
                    className="w-full min-h-[40px] bg-white border border-border rounded-[3px] text-sm text-foreground placeholder:text-muted-foreground placeholder:italic resize-none break-words overflow-hidden"
                />
                {e('desc') && <p className="text-xs mt-1 text-[#ff6467]">{e('desc')}</p>}
            </div>

            {/* Fee & delete */}
            <div className="col-span-3 flex items-start justify-between gap-4">
            
                {/* Fee */}
                <div className="flex flex-col w-full">
                    <InputGroup className="h-[40px] border border-border flex items-center pr-2 bg-white rounded-[3px]">
                        <InputGroupAddon className="text-sm pl-2 pr-1">{currency}</InputGroupAddon>
                        <InputGroupInput
                            name="fee"
                            placeholder="Set a price"
                            value={fee === 0 ? "" : fee}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0
                                onFeeChange?.(val)
                            }}
                            className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 focus:outline-none pr-2"
                        />
                        <div className="flex flex-col shrink-0">
                            <ChevronUp 
                                size={12}
                                className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]"
                                onClick={() => onAdjustPrice?.(100)} />
                            <ChevronDown 
                                size={12}
                                className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]"
                                onClick={() => onAdjustPrice?.(-100)} />
                        </div>
                    </InputGroup>
                    {e('fee') && <p className="text-xs mt-1 text-[#ff6467]">{e('fee')}</p>}
                </div>

                {/* Delete */}
                <button 
                    type="button" 
                    onClick={onRemove}
                    className="mt-2.5 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )    
}