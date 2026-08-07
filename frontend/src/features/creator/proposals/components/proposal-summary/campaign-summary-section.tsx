import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CampaignSummarySectionProps {
  brand: string
  creator: string
  campaignName: string
  platforms: string[]
  period: string
}

export function CampaignSummarySection({ brand, creator, campaignName, platforms, period }: CampaignSummarySectionProps) {
  const rows = [
    { detail: "BRAND", value: brand },
    { detail: "CREATOR", value: creator },
    { detail: "CAMPAIGN NAME", value: campaignName },
    { detail: "PLATFORMS", value: platforms.join(", ") },
    { detail: "PERIOD", value: period },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">1. Campaign Summary</h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-xs font-semibold uppercase">Detail</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.detail}>
              <TableCell className="text-xs text-muted-foreground font-medium">{row.detail}</TableCell>
              <TableCell className="text-xs text-foreground">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}