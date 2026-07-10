import { Card } from "@/src/components/atoms/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Deliverable } from "@/src/features/creator/proposals/types/deliverables.types"
import { DeliverableRow } from "@/src/features/creator/proposals/components/deliverables/deliverables-row"

export interface DeliverablesFormProps {
  deliverables: Deliverable[]
  errors: Record<string, string>
  platformOptions: string[]
  addDeliverable: () => void
  removeDeliverable: (id: number) => void
  updateDeliverable: (id: number, field: keyof Deliverable, value: string) => void
}

export default function DeliverablesForm({ deliverables, addDeliverable, removeDeliverable, updateDeliverable, errors, platformOptions }: DeliverablesFormProps) {
  const totalPrice = deliverables.reduce((sum, d) => sum + parseFloat(d.pricing.replace(/,/g, '') || '0'), 0)

  return (
    <div className="bg-white border border-border rounded p-5.5 flex flex-col gap-4">
      <h2 className="text-[26px] font-normal text-foreground">Deliverables</h2>

      <div className="flex flex-col gap-4">
        {deliverables.map((item, index) => (
          <DeliverableRow
            key={item.id}
            item={item}
            index={index}
            errors={errors}
            canRemove={index > 0}
            platformOptions={platformOptions}
            onUpdate={(field, value) => updateDeliverable(item.id, field, value)}
            onRemove={() => removeDeliverable(item.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <Button
          variant="outline"
          onClick={addDeliverable}
          className="border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#6b1fa8]/10 rounded-[2px]"
        >
          <Plus size={16} />
          Add another deliverable
        </Button>

        <Card className="px-6 py-3 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Total Price</span>
          <span className="text-2xl font-medium text-foreground">
            PHP {totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </Card>
      </div>
    </div>
  )
}
