import Workspace from "@/src/features/creator/workspace/containers/workspace-container";
import { use } from "react"

interface WorkspacePageProps {
  params: Promise<{ id: string }>
}

export default function Page({ params }: WorkspacePageProps) {
  const { id } = use(params)
  return <Workspace campaignId={id} />
}