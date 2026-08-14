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

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    bank_transfer: "Bank Transfer",
    gcash: "GCash",
    paypal: "PayPal",
    check: "Check",
}

const PAYMENT_SCHEDULE_LABELS: Record<string, string> = {
    DUE_FINAL_DELIVERY: "Due on Final Delivery",
    NET_15: "Net 15",
    NET_30: "Net 30",
    "50_DEPOSIT_50_FINAL": "50% Initial Deposit, 50% Due on Final Delivery",
}

export function PaymentDeliveryCard({ paymentMethod, paymentSchedule, shippingAddress }: PaymentDeliveryCardProps) {
    const methodLabel = PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod.replace(/_/g, " ")
    const scheduleLabel = PAYMENT_SCHEDULE_LABELS[paymentSchedule] ?? paymentSchedule.replace(/_/g, " ")
    return (
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Payment & Delivery</h2>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Payment Method</p>
                    <p className="text-sm text-foreground uppercase">{methodLabel || "—"}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Payment Schedule</p>
                    <p className="text-sm text-foreground">{scheduleLabel || "—"}</p>
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