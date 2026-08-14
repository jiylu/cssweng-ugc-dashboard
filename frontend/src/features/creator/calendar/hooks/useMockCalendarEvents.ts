/**
 * useMockCalendarEvents
 *
 * Synchronously converts MOCK_CAMPAIGNS into CalendarEvent[] using the same
 * mapper as the real API service, and returns an object with the same shape
 * as `useQuery` so it can be used as a drop-in replacement in CalendarView.
 *
 * Usage:
 *   const { data: events = [], isLoading } = useMockCalendarEvents();
 */

import { useMemo } from 'react';
import { MOCK_CAMPAIGNS } from '../calendar.mock';
import { mapCampaignsToEvents } from '../services/getCalendarEvents';
import { CalendarEvent } from '../types/calendar.types';

export function useMockCalendarEvents(): {
  data: CalendarEvent[];
  isLoading: false;
} {
  const data = useMemo(() => mapCampaignsToEvents(MOCK_CAMPAIGNS), []);

  return {
    data,
    isLoading: false,
  };
}
