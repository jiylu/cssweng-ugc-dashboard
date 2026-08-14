import { formatCurrency } from "@/src/features/creator/proposals/utils/formatCurrency"

interface DeliverableRow {
    qty: number
    deliverable: string
    format: string
    dueDate: string
    price: number
    currency: string
}

interface DeliverablesCardProps {
  deliverables: DeliverableRow[]
}

export function DeliverablesCard({ deliverables }: DeliverablesCardProps) {
    return (
        <div className="bg-white border border-border rounded-[3px] p-6 overflow-hidden flex flex-col">
            <h2 className="text-[26px] font-normal text-foreground mb-2">Deliverables</h2>

            <div className="grid grid-cols-12 gap-4 py-2 px-6 -mx-6 bg-[#e8e4dc] border-y border-border text-sm text-foreground font-medium">
                <div className="col-span-2 mt-1">Quantity</div>
                <div className="col-span-2 mt-1">Deliverable</div>
                <div className="col-span-4 mt-1">Format/Requirements</div>
                <div className="col-span-2 mt-1">Due Date</div>
                <div className="col-span-2 mt-1">Price</div>
            </div>

            <div className="flex flex-col">
                {deliverables.map((d, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-4 px-6 -mx-6 border-b border-border items-start">
                    <div className="col-span-2 text-sm text-foreground">{d.qty}</div>
                    <div className="col-span-2 text-sm text-foreground break-words">{d.deliverable}</div>
                    <div className="col-span-4 text-sm text-foreground break-words">{d.format}</div>
                    <div className="col-span-2 text-sm text-foreground">{d.dueDate || "——————"}</div>
                    <div className="col-span-2 text-sm text-foreground">
                        {formatCurrency(d.price, d.currency)}
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}
