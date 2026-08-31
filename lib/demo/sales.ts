import type { Dub } from "dub";
import {
  saleAmountCents,
  type DemoCustomer,
} from "./catalog";

export function monthlyInvoiceId(externalId: string, date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `inv_${externalId}_${year}-${month}`;
}

export async function trackSubscriptionSale({
  dub,
  customer,
  eventName,
}: {
  dub: Dub;
  customer: DemoCustomer;
  eventName: "Subscription created" | "Invoice paid";
}) {
  const amount = saleAmountCents(customer);
  if (amount === null) {
    return null;
  }

  const invoiceId = monthlyInvoiceId(customer.externalId);

  return dub.track.sale({
    customerExternalId: customer.externalId,
    amount,
    currency: "usd",
    eventName,
    paymentProcessor: "stripe",
    invoiceId,
  });
}
