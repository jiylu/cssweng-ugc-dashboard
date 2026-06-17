import { useMutation } from '@tanstack/react-query';
import { CreateCampaignPayload } from '../types/campaign-setup.types';
import { postCampaign } from '../../../../services/postCampaign';

export function useCreateCampaign() {
  return useMutation({
    mutationFn: ({ payload }: {
      payload: CreateCampaignPayload;
    }) => postCampaign(payload),
  });
}