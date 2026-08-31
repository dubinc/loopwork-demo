import {
  CUSTOMERS,
  PARTNERS,
  customersDueOn,
  saleAmountCents,
} from "../lib/demo/catalog";
import { createDubClient } from "../lib/demo/dub";
import { monthlyInvoiceId, trackSubscriptionSale } from "../lib/demo/sales";
import { trackClick } from "../lib/demo/track-click";

async function main() {
  const dub = createDubClient();
  const clickIdByPartner = new Map<string, string>();

  console.log(`Creating ${PARTNERS.length} partners…`);
  for (const partner of PARTNERS) {
    const created = await dub.partners.create({
      name: partner.name,
      email: partner.email,
      username: partner.username,
      tenantId: partner.tenantId,
      description: partner.description ?? null,
    });

    const link =
      created.links?.[0] ??
      (await dub.partners.retrieveLinks({ tenantId: partner.tenantId }))[0];
    if (!link) {
      throw new Error(
        `Partner ${partner.email} was created but has no referral link`,
      );
    }

    const clickId = await trackClick(link.domain, link.key);
    clickIdByPartner.set(partner.username, clickId);
    console.log(
      `  ${partner.name} (${partner.email}) → ${link.shortLink} click=${clickId}`,
    );
  }

  console.log(`\nTracking ${CUSTOMERS.length} leads…`);
  for (const customer of CUSTOMERS) {
    const clickId = clickIdByPartner.get(customer.partnerUsername);
    if (!clickId) {
      throw new Error(
        `No clickId for partner ${customer.partnerUsername} (${customer.name})`,
      );
    }

    await dub.track.lead({
      clickId,
      eventName: "Sign Up",
      customerExternalId: customer.externalId,
      customerName: customer.name,
      customerEmail: customer.email,
      mode: "wait",
    });
    console.log(
      `  ${customer.name} → ${customer.plan} / ${customer.seats} seats (${customer.partnerUsername})`,
    );
  }

  const dueToday = customersDueOn();
  if (dueToday.length === 0) {
    console.log(
      "\nNo customers bill today. First invoices land on each billing day via cron.",
    );
  } else {
    console.log(`\nTracking ${dueToday.length} subscription sale(s) due today…`);
    for (const customer of dueToday) {
      const amount = saleAmountCents(customer);
      await trackSubscriptionSale({
        dub,
        customer,
        eventName: "Subscription created",
      });
      console.log(
        `  ${customer.name} (day ${customer.billingDay}) → $${((amount ?? 0) / 100).toFixed(2)} (${monthlyInvoiceId(customer.externalId)})`,
      );
    }
  }

  console.log("\nSeed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
