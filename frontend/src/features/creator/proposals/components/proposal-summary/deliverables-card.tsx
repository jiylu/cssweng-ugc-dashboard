import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
        <Card className="flex flex-col gap-4 p-6">
            <h2 className="text-2xl font-normal text-foreground">Deliverables</h2>
            <Separator />
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em] w-16">QTY</TableHead>
                    <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Deliverable</TableHead>
                    <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Format/Requirements</TableHead>
                    <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Due Date</TableHead>
                    <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em] text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deliverables.map((d, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="text-sm text-foreground">{d.qty}</TableCell>
                        <TableCell className="text-sm text-foreground">{d.deliverable}</TableCell>
                        <TableCell className="text-sm text-foreground">{d.format}</TableCell>
                        <TableCell className="text-sm text-foreground">{d.dueDate || "——————"}</TableCell>
                        <TableCell className="text-sm text-foreground text-right">
                        ${d.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}