import { saleAmountCents } from "../lib/demo/catalog";
import { createDemoCommission } from "../lib/demo/demo-commission";
import { createDubClient } from "../lib/demo/dub";
import { organicBrowseClickCount } from "../lib/demo/funnel";
import { getPartnerLinks } from "../lib/demo/partners";
import { dailyNewCustomers, extraDailyCustomers } from "../lib/demo/prospects";
import { monthlyInvoiceId } from "../lib/demo/sales";
import { referrerAt } from "../lib/demo/traffic";
import { recordBrowseClicks, userAgentAt } from "../lib/demo/track-click";

// Set the UTC window before running. Do not re-run a range that's already filled.
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

function log(message: string) {
  console.log(`[${new Date().toISOString().slice(11, 23)}] ${message}`);
}

async function main() {
  const dub = createDubClient();
  const partnerLinks = await getPartnerLinks(dub);
  const linkByUsername = new Map(
    partnerLinks.map((entry) => [entry.partner.username, entry]),
  );

  const days = eachUtcDay(BACKFILL_START, BACKFILL_END);
  log(
    `backfilling ${days.length} days (${days[0].toISOString().slice(0, 10)} → ${days[days.length - 1].toISOString().slice(0, 10)})`,
  );

  let browseClicks = 0;
  let leads = 0;
  let sales = 0;
  let skipped = 0;

  for (const [dayIndex, day] of days.entries()) {
    const dateKey = day.toISOString().slice(0, 10);
    const browseAt = atUtcHour(day, 14, 0);
    const customers = [
      ...dailyNewCustomers(day),
      ...extraDailyCustomers(day),
    ];

    log(`\n=== ${dateKey}  day ${dayIndex + 1}/${days.length} ===`);

    for (const [partnerIndex, entry] of partnerLinks.entries()) {
      const count = organicBrowseClickCount(day, entry.partner.username);
      log(`browse ${entry.partner.username}: ${count} clicks`);
      const recorded = await recordBrowseClicks(
        entry.domain,
        entry.key,
        count,
        dayIndex * 40 + partnerIndex * 5,
        browseAt,
      );
      browseClicks += recorded.length;
    }

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
      const type = amount === null ? "lead" : "sale";

      try {
        const { clickId } = await createDemoCommission({
          domain: link.domain,
          key: link.key,
          date: eventAt,
          type,
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
          log(`lead ${customer.name} click=${clickId}`);
        } else {
          leads += 1;
          sales += 1;
          log(
            `sale ${customer.name} $${(amount / 100).toFixed(2)} click=${clickId}`,
          );
        }
      } catch (error) {
        skipped += 1;
        log(
          `error ${customer.name}: ${error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }

  log(
    `backfill complete. ${browseClicks} browse clicks, ${leads} leads, ${sales} sales, ${skipped} skipped.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
