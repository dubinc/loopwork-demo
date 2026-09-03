import { PARTNERS, type DemoPartner } from "./catalog";
import { seededInt, seededRandom } from "./random";

/** Browse clicks that never become a lead — the top of the funnel. */
export function seedBrowseClickCount(partner: DemoPartner) {
  return partner.description ? 14 : 8;
}

function dateKeyOf(date: Date) {
  return date.toISOString().slice(0, 10);
}

const DAILY_LEADS_MIN = 25;
const DAILY_LEADS_MAX = 35;
const DAILY_SALES_MIN = 15;
const DAILY_SALES_MAX = 25;
const CLICK_TO_LEAD_RATE_MIN = 0.08;
const CLICK_TO_LEAD_RATE_MAX = 0.14;

/** Organic total leads for one day (25–35). */
export function organicDailyLeadTarget(date: Date) {
  return seededInt(
    `leads-target:${dateKeyOf(date)}`,
    DAILY_LEADS_MIN,
    DAILY_LEADS_MAX,
  );
}

/** Organic total sales for one day (15–25). */
export function organicDailySalesTarget(date: Date) {
  return seededInt(
    `sales-target:${dateKeyOf(date)}`,
    DAILY_SALES_MIN,
    DAILY_SALES_MAX,
  );
}

function organicClickToLeadRate(date: Date) {
  const dateKey = dateKeyOf(date);
  return (
    CLICK_TO_LEAD_RATE_MIN +
    seededRandom(`click-rate:${dateKey}`) *
    (CLICK_TO_LEAD_RATE_MAX - CLICK_TO_LEAD_RATE_MIN)
  );
}

function organicDailyClickTotal(date: Date) {
  const leads = organicDailyLeadTarget(date);
  const rate = organicClickToLeadRate(date);
  return Math.max(leads, Math.round(leads / rate));
}

/** One partner's share of the day's funnel-derived browse clicks. */
export function organicBrowseClickCount(date: Date, partnerUsername: string) {
  const total = organicDailyClickTotal(date);
  const dateKey = dateKeyOf(date);

  const weights = PARTNERS.map(
    (partner) => 0.5 + seededRandom(`click-weight:${partner.username}:${dateKey}`),
  );
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  const shares = weights.map((weight) =>
    Math.max(1, Math.round((weight / weightSum) * total)),
  );
  const remainder = total - shares.reduce((sum, share) => sum + share, 0);
  shares[shares.length - 1] = Math.max(1, shares[shares.length - 1] + remainder);

  const index = PARTNERS.findIndex((partner) => partner.username === partnerUsername);
  return index >= 0
    ? shares[index]
    : Math.max(1, Math.round(total / PARTNERS.length));
}
