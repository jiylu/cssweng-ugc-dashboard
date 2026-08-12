interface WorkspaceHeaderProps {
  campaignName: string
  campaignOverview: string
}

export function WorkspaceHeader({ campaignName, campaignOverview }: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-0 max-w-120 min-w-0">
      <p className="text-lg text-muted-foreground break-words">{campaignName}</p>
      <p className="text-sm text-muted-foreground break-words">{campaignOverview}</p>
    </div>
  )
}