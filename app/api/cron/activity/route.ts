import { customersDueOn, saleAmountCents } from "@/lib/demo/catalog";
import { createDubClient } from "@/lib/demo/dub";
import { onboardCustomer } from "@/lib/demo/onboard";
import { getPartnerLinks } from "@/lib/demo/partners";
import {
  dailyNewCustomers,
  generatedCustomersToRenew,
} from "@/lib/demo/prospects";
import { monthlyInvoiceId, trackSubscriptionSale } from "@/lib/demo/sales";
import { CRON_BROWSE_CLICKS_PER_PARTNER } from "@/lib/demo/funnel";
import { recordBrowseClicks, userAgentAt } from "@/lib/demo/track-click";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dub = createDubClient();
  const partnerLinks = await getPartnerLinks(dub);
  const linkByUsername = new Map(
    partnerLinks.map((entry) => [entry.partner.username, entry]),
  );

  const clicks: Array<{ partner: string; count: number }> = [];
  for (const [index, entry] of partnerLinks.entries()) {
    const recorded = await recordBrowseClicks(
      entry.domain,
      entry.key,
      CRON_BROWSE_CLICKS_PER_PARTNER,
      index * 10,
    );
    clicks.push({
      partner: entry.partner.username,
      count: recorded.length,
    });
  }

  const leads: Array<{
    customerExternalId: string;
    partner: string;
    plan: string;
    clickId: string;
  }> = [];
  const newSales: Array<{
    customerExternalId: string;
    invoiceId: string;
    amount: number;
    ok: boolean;
    error?: string;
  }> = [];

  for (const [offset, customer] of dailyNewCustomers(now).entries()) {
    const link = linkByUsername.get(customer.partnerUsername);
    if (!link) {
      throw new Error(`No referral link for partner ${customer.partnerUsername}`);
    }

    try {
      const { clickId, amount } = await onboardCustomer({
        dub,
        customer,
        link,
        userAgent: userAgentAt(partnerLinks.length + offset),
        saleEventName: "Subscription created",
      });

      leads.push({
        customerExternalId: customer.externalId,
        partner: customer.partnerUsername,
        plan: customer.plan,
        clickId,
      });

      if (amount !== null) {
        newSales.push({
          customerExternalId: customer.externalId,
          invoiceId: monthlyInvoiceId(customer.externalId, now),
          amount,
          ok: true,
        });
      }
    } catch (error) {
      const amount = saleAmountCents(customer);
      if (amount !== null) {
        newSales.push({
          customerExternalId: customer.externalId,
          invoiceId: monthlyInvoiceId(customer.externalId, now),
          amount,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const renewals: Array<{
    customerExternalId: string;
    invoiceId: string;
    amount: number;
    ok: boolean;
    error?: string;
  }> = [];

  const toRenew = [...customersDueOn(now), ...generatedCustomersToRenew(now)];

  for (const customer of toRenew) {
    const amount = saleAmountCents(customer);
    const invoiceId = monthlyInvoiceId(customer.externalId, now);
    if (amount === null) {
      continue;
    }

    try {
      await trackSubscriptionSale({
        dub,
        customer,
        eventName: "Invoice paid",
      });
      renewals.push({
        customerExternalId: customer.externalId,
        invoiceId,
        amount,
        ok: true,
      });
    } catch (error) {
      renewals.push({
        customerExternalId: customer.externalId,
        invoiceId,
        amount,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return NextResponse.json({
    date: now.toISOString().slice(0, 10),
    clicks,
    leads,
    sales: {
      new: newSales,
      renewals,
    },
  });
}
