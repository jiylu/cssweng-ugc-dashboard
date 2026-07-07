import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GiftedProduct } from "@/src/features/creator/proposals/types/payment-terms.types"
import { GiftedProductRow } from "@/src/features/creator/proposals/components/payment-terms/gifted-product-row"

interface GiftedProductsSectionProps {
  giftedProducts: GiftedProduct[]
  errors: Record<string, string>
  onAdd: () => void
  onRemove: (id: number) => void
  onUpdate: (id: number, field: keyof GiftedProduct, value: string) => void
}

export function GiftedProductsSection({ giftedProducts, errors, onAdd, onRemove, onUpdate }: GiftedProductsSectionProps) {
  return (
    <div className="bg-white border border-border rounded p-5.5 flex flex-col gap-4">
      <h2 className="text-2xl font-normal text-foreground">Gifted Product / In-Kind Items</h2>

      <div className="flex flex-col gap-4">
        {giftedProducts.map((item, index) => (
          <GiftedProductRow
            key={item.id}
            item={item}
            index={index}
            errors={errors}
            onUpdate={(field, value) => onUpdate(item.id, field, value)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-2">
        <Button
          variant="outline"
          onClick={onAdd}
          className="border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/10 rounded-[2px] px-8"
        >
          <Plus size={16} />
          Add another gifted product
        </Button>
      </div>
    </div>
  )
}