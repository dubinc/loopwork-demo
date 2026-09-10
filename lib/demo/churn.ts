import type { DemoCustomer } from "./catalog";
import { DEMO_ACTIVITY_START } from "./prospects";
import { seededRandom } from "./random";

/** ~8% of renewal opportunities churn instead of paying that month. */
const MONTHLY_CHURN_RATE = 0.08;

function utcMonthKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function addUtcMonths(date: Date, months: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()),
  );
}

/** Signup day from generated external ids (`cus_slug_YYYY-MM-DD` / `_xN`). */
export function signupDateOf(customer: DemoCustomer): Date {
  const match = customer.externalId.match(/_(\d{4}-\d{2}-\d{2})(?:_x\d+)?$/);
  if (match) {
    return new Date(`${match[1]}T00:00:00.000Z`);
  }

  return new Date(DEMO_ACTIVITY_START);
}

function wouldChurnInMonth(externalId: string, month: Date) {
  return (
    seededRandom(`churn:${externalId}:${utcMonthKey(month)}`) <
    MONTHLY_CHURN_RATE
  );
}

/**
 * First billing month (after signup) this customer would cancel.
 * Null if they stay subscribed through `now`.
 */
export function firstChurnMonthFor(
  externalId: string,
  signup: Date,
  now = new Date(),
): Date | null {
  for (let monthsAgo = 1; monthsAgo <= 24; monthsAgo++) {
    const month = addUtcMonths(signup, monthsAgo);
    if (month.getTime() > now.getTime()) {
      break;
    }
    if (wouldChurnInMonth(externalId, month)) {
      return month;
    }
  }

  return null;
}

export function firstChurnMonth(customer: DemoCustomer, now = new Date()) {
  return firstChurnMonthFor(customer.externalId, signupDateOf(customer), now);
}

/** Already past their churn month — do not invoice. */
export function hasAlreadyChurnedFor(
  externalId: string,
  signup: Date,
  now = new Date(),
) {
  const churned = firstChurnMonthFor(externalId, signup, now);
  if (!churned) {
    return false;
  }

  return (
    utcMonthKey(churned) < utcMonthKey(now) ||
    (utcMonthKey(churned) === utcMonthKey(now) &&
      churned.getUTCDate() <= now.getUTCDate())
  );
}

export function hasAlreadyChurned(customer: DemoCustomer, now = new Date()) {
  return hasAlreadyChurnedFor(customer.externalId, signupDateOf(customer), now);
}

/** This billing cycle is the one they cancel on — mark canceled, skip the sale. */
export function isChurnMonth(customer: DemoCustomer, now = new Date()) {
  const churned = firstChurnMonth(customer, now);
  return churned !== null && utcMonthKey(churned) === utcMonthKey(now);
}
