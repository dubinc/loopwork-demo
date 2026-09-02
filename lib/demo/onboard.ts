import type { Dub } from "dub";
import { saleAmountCents, type DemoCustomer } from "./catalog";
import type { PartnerLink } from "./partners";
import { trackSubscriptionSale } from "./sales";
import { referrerAt } from "./traffic";
import { trackClick } from "./track-click";

export async function onboardCustomer({
  dub,
  customer,
  link,
  userAgent,
  saleEventName,
  clickIndex = 0,
}: {
  dub: Dub;
  customer: DemoCustomer;
  link: PartnerLink;
  userAgent: string;
  saleEventName: "Subscription created" | "Invoice paid";
  clickIndex?: number;
}) {
  const clickId = await trackClick(link.domain, link.key, {
    userAgent,
    referrer: referrerAt(clickIndex),
    country: customer.country,
  });

  await dub.track.lead({
    clickId,
    eventName: "Sign Up",
    customerExternalId: customer.externalId,
    customerName: customer.name,
    customerEmail: customer.email,
    mode: "wait",
  });

  if (customer.country) {
    await dub.customers.update({
      id: `ext_${customer.externalId}`,
      requestBody: { country: customer.country },
    });
  }

  const amount = saleAmountCents(customer);
  const sale =
    amount === null
      ? null
      : await trackSubscriptionSale({
        dub,
        customer,
        eventName: saleEventName,
      });

  return { clickId, amount, sale };
}
