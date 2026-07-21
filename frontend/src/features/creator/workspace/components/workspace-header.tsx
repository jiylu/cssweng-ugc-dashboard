interface WorkspaceHeaderProps {
  campaignName: string
  campaignOverview: string
}

export function WorkspaceHeader({ campaignName, campaignOverview }: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-sm text-muted-foreground">{campaignName}</p>
      <p className="text-sm text-muted-foreground">{campaignOverview}</p>
    </div>
  )
}