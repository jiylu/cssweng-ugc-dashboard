import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Deliverable {
  qty: number
  deliverable: string
  format: string
  dueDate: string
}

interface DeliverablesSectionProps {
  deliverables: Deliverable[]
}

export function DeliverablesSection({ deliverables }: DeliverablesSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">2. Deliverables</h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-xs font-semibold uppercase">QTY</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Deliverable</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Format</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliverables.map((d, i) => (
            <TableRow key={i} className={i % 2 === 0 ? "bg-[#f9f7f3]" : ""}>
              <TableCell className="text-xs">{d.qty}</TableCell>
              <TableCell className="text-xs">{d.deliverable}</TableCell>
              <TableCell className="text-xs">{d.format}</TableCell>
              <TableCell className="text-xs">{d.dueDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}