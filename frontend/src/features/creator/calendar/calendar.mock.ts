/**
 * MOCK_CAMPAIGNS — local development source of truth.
 *
 * Dates are computed relative to the current date so the calendar always shows
 * populated data regardless of when the app is run. Each campaign spans 3–6 weeks
 * and contains 3–4 deliverables with staggered due / post dates inside that window.
 *
 * To switch to the real API, set USE_MOCK = false in calendar-view.tsx.
 */

import { Campaign } from './types/calendar.types';
import {
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  format,
} from 'date-fns';

// ── helpers ───────────────────────────────────────────────────────────────────

const iso = (d: Date) => format(d, 'yyyy-MM-dd');

const now = new Date();
const thisMonthStart = startOfMonth(now);
const lastMonthStart = startOfMonth(subMonths(now, 1));
const nextMonthStart = startOfMonth(addMonths(now, 1));

// ── MOCK_CAMPAIGNS ─────────────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: Campaign[] = [
  // ── Campaign 1: Active — straddles last month → current month ────────────────
  {
    campaign_id: 'mock-camp-001',
    public_id: 'UGC-001',
    ugc_creator_id: 'mock-user-001',
    client_id: 'mock-client-001',
    project_name: 'Sunrise Skincare — Q3 Launch',
    description:
      'A 6-week UGC campaign featuring before/after content for the new Sunrise Vitamin C serum line.',
    currency: 'USD',
    tax: 0.12,
    pricing: 2400,
    platforms: { TikTok: '@brand', Instagram: '@brand' },
    start_date: iso(subDays(thisMonthStart, 10)),
    end_date:   iso(addDays(thisMonthStart, 24)),
    campaign_status: 'ACTIVE',
    deliverables: [
      {
        deliverable_id: 'mock-del-001a',
        public_id: 'DEL-001A',
        campaign_id: 'mock-camp-001',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: '60-sec TikTok unboxing',
        requirements: 'Show product in natural light, include verbal review.',
        due_date:  iso(addDays(thisMonthStart, 3)),
        post_date: iso(addDays(thisMonthStart, 5)),
        pricing: 600,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-001b',
        public_id: 'DEL-001B',
        campaign_id: 'mock-camp-001',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'Instagram Reel — morning routine integration',
        requirements: 'Feature serum step prominently, use provided audio track.',
        due_date:  iso(addDays(thisMonthStart, 10)),
        post_date: iso(addDays(thisMonthStart, 13)),
        pricing: 800,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-001c',
        public_id: 'DEL-001C',
        campaign_id: 'mock-camp-001',
        quantity: 1,
        deliverable_type: 'COLLABORATION',
        deliverable_content: 'Before/After photo carousel — 4 slides',
        requirements: 'Photos taken in the same location, same lighting.',
        due_date:  iso(addDays(thisMonthStart, 18)),
        post_date: iso(addDays(thisMonthStart, 21)),
        pricing: 500,
        is_deleted: false,
      },
    ],
  },

  // ── Campaign 2: Active — current month only ───────────────────────────────────
  {
    campaign_id: 'mock-camp-002',
    public_id: 'UGC-002',
    ugc_creator_id: 'mock-user-001',
    client_id: 'mock-client-002',
    project_name: 'FitFlow Apparel — Summer Drop',
    description:
      'Active-wear content showcasing the new Summer 2026 collection across TikTok and YouTube Shorts.',
    currency: 'CAD',
    tax: 0.13,
    pricing: 3200,
    platforms: { TikTok: '@brand', YouTube: '@brand' },
    start_date: iso(addDays(thisMonthStart, 2)),
    end_date:   iso(addDays(thisMonthStart, 28)),
    campaign_status: 'ACTIVE',
    deliverables: [
      {
        deliverable_id: 'mock-del-002a',
        public_id: 'DEL-002A',
        campaign_id: 'mock-camp-002',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'GRWM TikTok — workout fit-check',
        requirements: 'Film at gym, tag @FitFlowOfficial.',
        due_date:  iso(addDays(thisMonthStart, 7)),
        post_date: iso(addDays(thisMonthStart, 9)),
        pricing: 700,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-002b',
        public_id: 'DEL-002B',
        campaign_id: 'mock-camp-002',
        quantity: 2,
        deliverable_type: 'COLLABORATION',
        deliverable_content: 'YouTube Short — 3 outfit styling ideas',
        requirements: 'Must include discount code FITFLOW20 verbally.',
        due_date:  iso(addDays(thisMonthStart, 14)),
        post_date: iso(addDays(thisMonthStart, 16)),
        pricing: 900,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-002c',
        public_id: 'DEL-002C',
        campaign_id: 'mock-camp-002',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'TikTok — summer outdoor workout montage',
        requirements: 'Minimum 45 seconds, trending audio optional.',
        due_date:  iso(addDays(thisMonthStart, 22)),
        post_date: iso(addDays(thisMonthStart, 25)),
        pricing: 650,
        is_deleted: false,
      },
    ],
  },

  // ── Campaign 3: Completed — last month ───────────────────────────────────────
  {
    campaign_id: 'mock-camp-003',
    public_id: 'UGC-003',
    ugc_creator_id: 'mock-user-001',
    client_id: 'mock-client-003',
    project_name: 'BrewCraft Coffee — Brand Awareness',
    description:
      'A 4-week micro-influencer campaign promoting the single-origin cold brew range.',
    currency: 'USD',
    tax: 0.1,
    pricing: 1800,
    platforms: { Instagram: '@brand', TikTok: '@brand' },
    start_date: iso(addDays(lastMonthStart, 5)),
    end_date:   iso(addDays(lastMonthStart, 26)),
    campaign_status: 'COMPLETED',
    deliverables: [
      {
        deliverable_id: 'mock-del-003a',
        public_id: 'DEL-003A',
        campaign_id: 'mock-camp-003',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'Instagram Story series — 3-part morning ritual',
        requirements: 'Use provided branded sticker pack.',
        due_date:  iso(addDays(lastMonthStart, 10)),
        post_date: iso(addDays(lastMonthStart, 12)),
        pricing: 500,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-003b',
        public_id: 'DEL-003B',
        campaign_id: 'mock-camp-003',
        quantity: 1,
        deliverable_type: 'COLLABORATION',
        deliverable_content: 'TikTok — taste test vs. competitor brand',
        requirements: 'Keep comparison fair and brand-safe.',
        due_date:  iso(addDays(lastMonthStart, 20)),
        post_date: iso(addDays(lastMonthStart, 23)),
        pricing: 700,
        is_deleted: false,
      },
    ],
  },

  // ── Campaign 4: Active — spans current month → next month ────────────────────
  {
    campaign_id: 'mock-camp-004',
    public_id: 'UGC-004',
    ugc_creator_id: 'mock-user-001',
    client_id: 'mock-client-004',
    project_name: 'NovaTech Earbuds — Product Launch',
    description:
      'Launch campaign for the NovaTech ProBuds X wireless earbuds targeting Gen-Z audiences.',
    currency: 'USD',
    tax: 0.08,
    pricing: 4500,
    platforms: { TikTok: '@brand', Instagram: '@brand', YouTube: '@brand' },
    start_date: iso(addDays(thisMonthStart, 15)),
    end_date:   iso(addDays(nextMonthStart, 14)),
    campaign_status: 'ACTIVE',
    deliverables: [
      {
        deliverable_id: 'mock-del-004a',
        public_id: 'DEL-004A',
        campaign_id: 'mock-camp-004',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'Unboxing TikTok — first impressions',
        requirements: 'Film in 4K, show all package contents.',
        due_date:  iso(addDays(thisMonthStart, 19)),
        post_date: iso(addDays(thisMonthStart, 20)),
        pricing: 800,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-004b',
        public_id: 'DEL-004B',
        campaign_id: 'mock-camp-004',
        quantity: 1,
        deliverable_type: 'COLLABORATION',
        deliverable_content: 'Instagram Reel — "day in my life" integration',
        requirements: 'Feature earbuds in at least 3 distinct scenes.',
        due_date:  iso(addDays(thisMonthStart, 26)),
        post_date: iso(addDays(nextMonthStart, 1)),
        pricing: 1000,
        is_deleted: false,
      },
      {
        deliverable_id: 'mock-del-004c',
        public_id: 'DEL-004C',
        campaign_id: 'mock-camp-004',
        quantity: 1,
        deliverable_type: 'UGC',
        deliverable_content: 'YouTube Short — 30-day review',
        requirements: 'Honest review, include pros and cons.',
        due_date:  iso(addDays(nextMonthStart, 8)),
        post_date: iso(addDays(nextMonthStart, 12)),
        pricing: 1200,
        is_deleted: false,
      },
    ],
  },
];
