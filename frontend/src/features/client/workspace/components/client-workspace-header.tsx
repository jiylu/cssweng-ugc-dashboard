import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface ClientWorkspaceHeaderProps {
  campaignName: string;
  campaignOverview: string;
  progress: ReactNode;
}

/**
 * Client-owned workspace header. Its layout intentionally mirrors the creator
 * workspace while keeping client progress behaviour supplied by its container.
 */
export function ClientWorkspaceHeader({
  campaignName,
  campaignOverview,
  progress,
}: ClientWorkspaceHeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <h1 className="text-4xl font-normal text-foreground">Workspace</h1>
      </div>
      <Separator />
      <div className="flex items-start justify-between bg-white px-8 py-7">
        <div className="flex min-w-0 max-w-120 flex-col gap-0">
          <p className="text-xl text-foreground break-words">{campaignName}</p>
          <p className="text-sm text-foreground break-words">
            {campaignOverview}
          </p>
        </div>
        {progress}
      </div>
    </>
  );
}
