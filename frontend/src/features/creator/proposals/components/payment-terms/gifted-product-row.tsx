import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { GiftedProduct } from "@/src/features/creator/proposals/types/payment-terms.types"

interface GiftedProductRowProps {
  item: GiftedProduct
  index: number
  errors: Record<string, string>
  onUpdate: (field: keyof GiftedProduct, value: string) => void
  onRemove: () => void
}

export function GiftedProductRow({ item, index, errors, onUpdate, onRemove }: GiftedProductRowProps) {
    const e = (field: string) => errors[`giftedProducts.${index}.${field}`]

    return (
    <div className="bg-[#F2F0EA] border border-border rounded-[3px] p-5 flex gap-4 relative">
        <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
        >
        <Trash2 size={16} />
        </button>

        {/* Left side */}
        <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-end gap-4">
            {/* Product Name */}
            <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">PRODUCT NAME</label>
            <Input
                value={item.productName}
                onChange={(e) => onUpdate('productName', e.target.value)}
                placeholder="Enter Product Name"
                className="border-border rounded-[3px] text-sm bg-white"
            />
            {e('productName') && <p className="text-xs mt-1 text-[#ff6467]">{e('productName')}</p>}
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1 w-48 shrink-0">
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">VALUE</label>
            <div className="flex items-center gap-1">
                <InputGroup className="border border-border rounded-[3px] bg-white">
                    <InputGroupInput
                        placeholder="0"
                        value={item.value}
                        className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0 px-2"
                        onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '')
                        const parts = val.split('.')
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        onUpdate('value', parts.slice(0, 2).join('.'))
                        }}
                    />
                    <InputGroupAddon>PHP</InputGroupAddon>
                </InputGroup>
                {e('value') && <p className="text-xs mt-1 text-[#ff6467]">{e('value')}</p>}
                <div className="flex flex-col shrink-0">
                <ChevronUp size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" onClick={() => {
                    const current = parseFloat(item.value.replace(/,/g, '') || '0')
                    const newVal = (current + 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    onUpdate('value', newVal)
                }} />
                <ChevronDown size={12} className="cursor-pointer text-muted-foreground hover:text-[#6b1fa8]" onClick={() => {
                    const current = parseFloat(item.value.replace(/,/g, '') || '0')
                    const newVal = Math.max(0, current - 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    onUpdate('value', newVal)
                }} />
                </div>
            </div>
            </div>
        </div>

        {/* Ownership Terms */}
        <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">OWNERSHIP TERMS</label>
            <Textarea
            value={item.ownershipTerms}
            onChange={(e) => onUpdate('ownershipTerms', e.target.value)}
            placeholder="Enter ownership terms"
            className="min-h-[160px] bg-white resize-none border border-border rounded-[3px] text-sm text-foreground placeholder:text-muted-foreground placeholder:italic"
            />
            {e('ownershipTerms') && <p className="text-xs mt-1 text-[#ff6467]">{e('ownershipTerms')}</p>}
        </div>
        </div>

        {/* Right side - Delivery Details */}
        <div className="w-56 shrink-0 bg-white border border-border rounded-[3px] p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-[#6b1fa8] uppercase tracking-[0.03em]">Delivery Details</p>

        <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Shipping Address</label>
            <Input
            value={item.shippingAddress}
            onChange={(e) => onUpdate('shippingAddress', e.target.value)}
            placeholder="Enter address"
            className="border-border rounded-[3px] text-sm"
            />
            {e('shippingAddress') && <p className="text-xs mt-1 text-[#ff6467]">{e('shippingAddress')}</p>}
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Delivery Instructions</label>
            <Textarea
            value={item.deliveryInstructions}
            onChange={(e) => onUpdate('deliveryInstructions', e.target.value)}
            placeholder="Indicate any delivery instructions"
            className="min-h-[120px] resize-none border border-border rounded-[3px] text-sm bg-transparent placeholder:text-muted-foreground placeholder:italic"
            />
        </div>
        </div>
    </div>
    )
}