import { CUSTOMERS } from "./catalog";
import { firstChurnMonthFor, hasAlreadyChurnedFor } from "./churn";
import type { WorkspaceCustomer } from "./workspace-customers";

const catalogBillingDay = new Map(
  CUSTOMERS.flatMap((customer) =>
    customer.billingDay ? [[customer.externalId, customer.billingDay] as const] : [],
  ),
);

export function billingDayOf(customer: WorkspaceCustomer) {
  const catalogDay = catalogBillingDay.get(customer.externalId);
  if (catalogDay) {
    return catalogDay;
  }

  if (!customer.firstSaleAt) {
    return null;
  }

  return new Date(customer.firstSaleAt).getUTCDate();
}

export function invoiceAmountCents(customer: WorkspaceCustomer) {
  const sales = customer.sales ?? 0;
  const saleAmount = customer.saleAmount ?? 0;
  if (sales <= 0 || saleAmount <= 0) {
    return null;
  }

  return Math.round(saleAmount / sales);
}

function daysInUtcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** Monthly invoice dates after the first sale, through `through` (inclusive). */
export function eachBillDate(
  firstSaleAt: Date,
  billingDay: number,
  through: Date,
) {
  const dates: Date[] = [];
  let year = firstSaleAt.getUTCFullYear();
  let month = firstSaleAt.getUTCMonth();

  for (let step = 0; step < 36; step++) {
    const day = Math.min(billingDay, daysInUtcMonth(year, month));
    const bill = new Date(Date.UTC(year, month, day, 15, 0, 0));
    if (bill.getTime() > through.getTime()) {
      break;
    }
    if (bill.getTime() > firstSaleAt.getTime()) {
      dates.push(bill);
    }
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return dates;
}

export function isPayingCustomer(customer: WorkspaceCustomer) {
  return Boolean(
    customer.externalId &&
    customer.firstSaleAt &&
    (customer.sales ?? 0) > 0 &&
    invoiceAmountCents(customer) !== null,
  );
}

/** Already-paying customers whose monthly invoice falls on `now`. */
export function customersDueToRenew(
  customers: WorkspaceCustomer[],
  now = new Date(),
) {
  const startOfToday = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  return customers.filter((customer) => {
    if (!isPayingCustomer(customer) || !customer.firstSaleAt) {
      return false;
    }
    if (customer.subscriptionCanceledAt) {
      return false;
    }

    const firstSaleAt = new Date(customer.firstSaleAt);
    if (firstSaleAt.getTime() >= startOfToday) {
      return false;
    }

    return billingDayOf(customer) === now.getUTCDate();
  });
}

export function commissionCountry(country?: string | null) {
  if (country && /^[A-Z]{2}$/i.test(country)) {
    return country.toUpperCase();
  }

  return "US";
}

export function planRenewal(
  customer: WorkspaceCustomer,
  bill: Date,
): "skip" | "churn" | "invoice" {
  if (!isPayingCustomer(customer) || !customer.firstSaleAt) {
    return "skip";
  }

  if (customer.subscriptionCanceledAt) {
    const canceledAt = new Date(customer.subscriptionCanceledAt);
    if (canceledAt.getTime() <= bill.getTime()) {
      return "skip";
    }
  }

  const signup = new Date(customer.firstSaleAt);
  if (hasAlreadyChurnedFor(customer.externalId, signup, bill)) {
    return "churn";
  }

  return "invoice";
}

export function churnDateOf(customer: WorkspaceCustomer, bill: Date) {
  if (!customer.firstSaleAt) {
    return bill;
  }

  return (
    firstChurnMonthFor(
      customer.externalId,
      new Date(customer.firstSaleAt),
      bill,
    ) ?? bill
  );
}
