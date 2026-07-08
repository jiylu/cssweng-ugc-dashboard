import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '../services/getCalendarEvents';

export const useCalendarEvents = (creatorId: string | undefined) => {
  return useQuery({
    queryKey: ['calendarEvents', creatorId],
    queryFn: () => getCalendarEvents(creatorId!),
    // Don't run the query if we don't have a creatorId yet (e.g., auth is still loading)
    enabled: !!creatorId, 
  });
};