import { saleAmountCents } from "../lib/demo/catalog";
import { createDemoCommission } from "../lib/demo/demo-commission";
import { createDubClient } from "../lib/demo/dub";
import { BACKFILL_BROWSE_CLICKS_PER_PARTNER } from "../lib/demo/funnel";
import { getPartnerLinks } from "../lib/demo/partners";
import { backfillExtraCustomers, dailyNewCustomers } from "../lib/demo/prospects";
import { monthlyInvoiceId } from "../lib/demo/sales";
import { referrerAt } from "../lib/demo/traffic";
import { recordBrowseClicks, userAgentAt } from "../lib/demo/track-click";

const BACKFILL_START = Date.UTC(2026, 7, 3);
const BACKFILL_END = Date.UTC(2026, 7, 31);
const DAY_MS = 86_400_000;

function eachUtcDay(start: number, end: number) {
  const days: Date[] = [];
  for (let time = start; time <= end; time += DAY_MS) {
    days.push(new Date(time));
  }
  return days;
}

function atUtcHour(day: Date, hour: number, minute = 0) {
  return new Date(
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate(),
      hour,
      minute,
    ),
  );
}

async function main() {
  const dub = createDubClient();
  const partnerLinks = await getPartnerLinks(dub);
  const linkByUsername = new Map(
    partnerLinks.map((entry) => [entry.partner.username, entry]),
  );

  const days = eachUtcDay(BACKFILL_START, BACKFILL_END);
  console.log(
    `Backfilling ${days.length} days (${days[0].toISOString().slice(0, 10)} → ${days[days.length - 1].toISOString().slice(0, 10)})…`,
  );

  let browseClicks = 0;
  let leads = 0;
  let sales = 0;

  for (const [dayIndex, day] of days.entries()) {
    const dateKey = day.toISOString().slice(0, 10);
    const browseAt = atUtcHour(day, 14, 0);

    console.log(`\n${dateKey}`);

    for (const [partnerIndex, entry] of partnerLinks.entries()) {
      const recorded = await recordBrowseClicks(
        entry.domain,
        entry.key,
        BACKFILL_BROWSE_CLICKS_PER_PARTNER,
        dayIndex * 40 + partnerIndex * 5,
        browseAt,
      );
      browseClicks += recorded.length;
      console.log(
        `  browse ${entry.partner.username}: ${recorded.length} clicks`,
      );
    }

    const customers = [
      ...dailyNewCustomers(day),
      ...backfillExtraCustomers(day),
    ];

    for (const [offset, customer] of customers.entries()) {
      const link = linkByUsername.get(customer.partnerUsername);
      if (!link) {
        throw new Error(
          `No referral link for partner ${customer.partnerUsername}`,
        );
      }

      const amount = saleAmountCents(customer);
      const eventAt = atUtcHour(day, 15, offset * 10);
      const slot = dayIndex * 10 + offset;

      const { clickId } = await createDemoCommission({
        domain: link.domain,
        key: link.key,
        date: eventAt,
        type: amount === null ? "lead" : "sale",
        customer,
        referrer: referrerAt(slot),
        userAgent: userAgentAt(slot),
        country: customer.country,
        ...(amount !== null && {
          sale: {
            amount,
            invoiceId: monthlyInvoiceId(customer.externalId, day),
            eventName: "Subscription created",
          },
        }),
      });

      if (amount === null) {
        leads += 1;
        console.log(`  lead ${customer.name} click=${clickId}`);
      } else {
        leads += 1;
        sales += 1;
        console.log(
          `  sale ${customer.name} $${(amount / 100).toFixed(2)} click=${clickId}`,
        );
      }
    }
  }

  console.log(
    `\nBackfill complete. ${browseClicks} browse clicks, ${leads} leads, ${sales} sales.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
