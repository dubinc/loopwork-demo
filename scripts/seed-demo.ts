import {
  CUSTOMERS,
  TRIAL_CUSTOMERS,
  saleAmountCents,
} from "../lib/demo/catalog";
import { createDubClient } from "../lib/demo/dub";
import { seedBrowseClickCount } from "../lib/demo/funnel";
import { onboardCustomer } from "../lib/demo/onboard";
import { ensurePartnerLinks } from "../lib/demo/partners";
import { monthlyInvoiceId } from "../lib/demo/sales";
import { recordBrowseClicks, userAgentAt } from "../lib/demo/track-click";

const SEED_CUSTOMERS = [...CUSTOMERS, ...TRIAL_CUSTOMERS];

async function main() {
  const dub = createDubClient();

  console.log("Creating partners…");
  const partnerLinks = await ensurePartnerLinks(dub);
  const linkByUsername = new Map(
    partnerLinks.map((entry) => [entry.partner.username, entry]),
  );

  for (const entry of partnerLinks) {
    console.log(
      `  ${entry.partner.name} (${entry.partner.email}) → ${entry.shortLink}`,
    );
  }

  console.log("\nRecording browse clicks (no lead)…");
  let browseClicks = 0;
  for (const [index, entry] of partnerLinks.entries()) {
    const count = seedBrowseClickCount(entry.partner);
    await recordBrowseClicks(
      entry.domain,
      entry.key,
      count,
      index * 20,
    );
    browseClicks += count;
    console.log(`  ${entry.partner.username}: ${count} clicks`);
  }

  console.log(
    `\nOnboarding ${SEED_CUSTOMERS.length} customers (click → lead → sale if paid)…`,
  );

  for (const [index, customer] of SEED_CUSTOMERS.entries()) {
    const link = linkByUsername.get(customer.partnerUsername);
    if (!link) {
      throw new Error(
        `No referral link for partner ${customer.partnerUsername} (${customer.name})`,
      );
    }

    const { clickId, amount } = await onboardCustomer({
      dub,
      customer,
      link,
      userAgent: userAgentAt(200 + index),
      saleEventName: "Subscription created",
    });

    const saleLabel =
      amount === null
        ? "lead only"
        : `$${((amount ?? 0) / 100).toFixed(2)} (${monthlyInvoiceId(customer.externalId)})`;

    console.log(
      `  ${customer.name} → ${customer.plan} / ${customer.seats} seats via ${customer.partnerUsername} click=${clickId} ${saleLabel}`,
    );
  }

  const paid = SEED_CUSTOMERS.filter(
    (customer) => saleAmountCents(customer) !== null,
  );
  console.log(
    `\nSeed complete. ~${browseClicks + SEED_CUSTOMERS.length} clicks, ${SEED_CUSTOMERS.length} leads, ${paid.length} sales.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
