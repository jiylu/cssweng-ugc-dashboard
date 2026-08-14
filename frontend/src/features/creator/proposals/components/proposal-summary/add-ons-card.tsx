import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/src/features/creator/proposals/utils/formatCurrency"

interface AddOnRow {
    name: string
    description: string
    price: number
}

interface AddOnsSummaryCardProps {
  addOns: AddOnRow[]
  currency: string
}

export function AddOnsSummaryCard({ addOns, currency }: AddOnsSummaryCardProps) {
    if (addOns.length === 0) return null

    return (
    <Card className="flex flex-col gap-4 p-6">
        <h2 className="text-2xl font-normal text-foreground">Add-Ons</h2>
        <Separator />

        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Add-On</TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em]">Description</TableHead>
                <TableHead className="text-xs text-muted-foreground uppercase tracking-[0.03em] text-right">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {addOns.map((addon, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="text-sm text-foreground">{addon.name}</TableCell>
                    <TableCell className="text-sm text-foreground">{addon.description}</TableCell>
                    <TableCell className="text-sm text-foreground text-right">
                    {formatCurrency(addon.price, currency)}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </Card>
    )
}
