"use client";

import { use } from "react";
import ClientWorkspace from "@/src/features/client/workspace/containers/client-workspace";

export default function ClientWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ClientWorkspace campaignId={id} />;
}
