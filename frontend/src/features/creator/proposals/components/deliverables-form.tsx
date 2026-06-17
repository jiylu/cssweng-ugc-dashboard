import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/src/components/atoms/card";

export default function DeliverablesForm() {
  return(
    <Card className="col-span-full">
      <h2 className="text-[26px] font-normal text-foreground">
        Deliverables & Pricing
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Deliverable</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </Card>
  )
}