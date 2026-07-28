import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UsageRight {
  type: string
  duration: string
}

interface UsageRightsSectionProps {
  usageRights: UsageRight[]
  territory: string
}

export function UsageRightsSection({ usageRights, territory }: UsageRightsSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">5. Usage Rights and Ownership</h3>
      <p className="text-xs text-muted-foreground">
        Creator grants Brand a non-exclusive, royalty-free license to use the content across specified channels for the agreed duration.
      </p>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-xs font-semibold uppercase">Usage Type</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usageRights.map((u, i) => (
            <TableRow key={i} className={i % 2 === 0 ? "bg-[#f9f7f3]" : ""}>
              <TableCell className="text-xs font-medium">{u.type}</TableCell>
              <TableCell className="text-xs">{u.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}