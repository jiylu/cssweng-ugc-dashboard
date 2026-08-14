import { useQuery } from "@tanstack/react-query";
import { getClientCampaigns } from "../services/client-campaigns-api";

export function useClientCampaigns(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client-campaigns", clientId],
    queryFn: () => getClientCampaigns(clientId!),
    enabled: !!clientId,
  });
}
