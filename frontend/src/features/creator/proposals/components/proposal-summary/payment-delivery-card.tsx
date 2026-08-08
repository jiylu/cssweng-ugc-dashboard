import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"

interface PaymentDeliveryCardProps {
    paymentMethod: string
    paymentSchedule: string
    shippingAddress?: {
    name?: string
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    zipCode: string
    country: string
    } | null
}

export function PaymentDeliveryCard({ paymentMethod, paymentSchedule, shippingAddress }: PaymentDeliveryCardProps) {
    return (
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Payment & Delivery</h2>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Payment Method</p>
                    <p className="text-sm text-foreground">{paymentMethod || "—"}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Payment Schedule</p>
                    <p className="text-sm text-foreground">{paymentSchedule || "—"}</p>
                </div>
            </div>

            {shippingAddress && (
            <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Shipping Address</p>
                <div className="border border-border rounded-[3px] p-3 text-sm text-foreground flex flex-col gap-0.5">
                {shippingAddress.name && <p>{shippingAddress.name}</p>}
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.stateProvince} {shippingAddress.zipCode}</p>
                <p>{shippingAddress.country}</p>
                </div>
            </div>
            )}
        </Card>
    )
}