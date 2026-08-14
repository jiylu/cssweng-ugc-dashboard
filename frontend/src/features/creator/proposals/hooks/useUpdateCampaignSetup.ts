import { useMutation } from "@tanstack/react-query"
import { updateCampaignSetup } from "../services/submitted-proposals-api"
import { UpdateCampaignSetupPayload } from "../types/update-campaign-setup.types"

export function useUpdateCampaignSetup() {
  return useMutation({
    mutationFn: ({
      campaignPublicId,
      payload,
    }: {
      campaignPublicId: string
      payload: UpdateCampaignSetupPayload
    }) => updateCampaignSetup(campaignPublicId, payload),
  })
}
