import { useMutation } from '@tanstack/react-query';
import { postCampaign } from './../createCampaign/services/postCampaign';
import { CreateCampaignPayload } from './../createCampaign/types/campaign';

export function useCreateCampaign() {
  return useMutation({
    mutationFn: ({ payload }: {
      payload: CreateCampaignPayload;
    }) => postCampaign(payload),
  });
}