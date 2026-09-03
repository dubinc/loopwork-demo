import type { DemoPartner } from "./catalog";

/** Browse clicks that never become a lead — the top of the funnel. */
export function seedBrowseClickCount(partner: DemoPartner) {
  return partner.description ? 14 : 8;
}

export const CRON_BROWSE_CLICKS_PER_PARTNER = 5;

/** Browse clicks per partner per day in the August history backfill. */
export const BACKFILL_BROWSE_CLICKS_PER_PARTNER = 4;
