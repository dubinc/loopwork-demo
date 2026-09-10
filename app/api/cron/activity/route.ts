import { saleAmountCents } from "@/lib/demo/catalog";
import { cancelCustomerSubscription } from "@/lib/demo/cancel-subscription";
import { mapWithConcurrency } from "@/lib/demo/concurrency";
import { createDubClient } from "@/lib/demo/dub";
import { organicBrowseClickCount } from "@/lib/demo/funnel";
import { onboardCustomer } from "@/lib/demo/onboard";
import { getPartnerLinks } from "@/lib/demo/partners";
import { dailyNewCustomers, extraDailyCustomers } from "@/lib/demo/prospects";
import {
  churnDateOf,
  customersDueToRenew,
  invoiceAmountCents,
  planRenewal,
} from "@/lib/demo/renewals";
import { monthlyInvoiceId, trackInvoicePaid } from "@/lib/demo/sales";
import { recordBrowseClicks, userAgentAt } from "@/lib/demo/track-click";
import { listWorkspaceCustomers } from "@/lib/demo/workspace-customers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

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

  const clicks = await mapWithConcurrency(
    partnerLinks,
    partnerLinks.length,
    async (entry, index) => {
      const count = organicBrowseClickCount(now, entry.partner.username);
      const recorded = await recordBrowseClicks(
        entry.domain,
        entry.key,
        count,
        index * 60,
      );
      return { partner: entry.partner.username, count: recorded.length };
    },
  );

  const customers = [...dailyNewCustomers(now), ...extraDailyCustomers(now)];

  type LeadResult = {
    customerExternalId: string;
    partner: string;
    plan: string;
    clickId: string;
  };
  type SaleResult = {
    customerExternalId: string;
    invoiceId: string;
    amount: number;
    ok: boolean;
    error?: string;
  };

  const onboardResults = await mapWithConcurrency(
    customers,
    5,
    async (customer, offset) => {
      const link = linkByUsername.get(customer.partnerUsername);
      if (!link) {
        throw new Error(
          `No referral link for partner ${customer.partnerUsername}`,
        );
      }

      try {
        const { clickId, amount } = await onboardCustomer({
          dub,
          customer,
          link,
          userAgent: userAgentAt(partnerLinks.length + offset),
          saleEventName: "Subscription created",
          clickIndex: partnerLinks.length + offset,
        });

        const lead: LeadResult = {
          customerExternalId: customer.externalId,
          partner: customer.partnerUsername,
          plan: customer.plan,
          clickId,
        };

        const sale: SaleResult | null =
          amount !== null
            ? {
              customerExternalId: customer.externalId,
              invoiceId: monthlyInvoiceId(customer.externalId, now),
              amount,
              ok: true,
            }
            : null;

        return { lead, sale };
      } catch (error) {
        const amount = saleAmountCents(customer);
        const sale: SaleResult | null =
          amount !== null
            ? {
              customerExternalId: customer.externalId,
              invoiceId: monthlyInvoiceId(customer.externalId, now),
              amount,
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            }
            : null;

        return { lead: null as LeadResult | null, sale };
      }
    },
  );

  const leads: LeadResult[] = [];
  const newSales: SaleResult[] = [];
  for (const result of onboardResults) {
    if (result.lead) {
      leads.push(result.lead);
    }
    if (result.sale) {
      newSales.push(result.sale);
    }
  }

  const toRenew = customersDueToRenew(await listWorkspaceCustomers(), now);

  type ChurnResult = {
    customerExternalId: string;
    ok: boolean;
    error?: string;
  };

  const renewalResults = await mapWithConcurrency(
    toRenew,
    8,
    async (
      customer,
    ): Promise<
      | { kind: "sale"; sale: SaleResult }
      | { kind: "churn"; churn: ChurnResult }
      | null
    > => {
      const amount = invoiceAmountCents(customer);
      const invoiceId = monthlyInvoiceId(customer.externalId, now);
      if (amount === null) {
        return null;
      }

      const plan = planRenewal(customer, now);
      if (plan === "skip") {
        return null;
      }

      if (plan === "churn") {
        try {
          await cancelCustomerSubscription(
            customer.externalId,
            churnDateOf(customer, now),
          );
          return {
            kind: "churn",
            churn: { customerExternalId: customer.externalId, ok: true },
          };
        } catch (error) {
          return {
            kind: "churn",
            churn: {
              customerExternalId: customer.externalId,
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            },
          };
        }
      }

      try {
        await trackInvoicePaid({
          dub,
          customerExternalId: customer.externalId,
          amount,
          date: now,
        });
        return {
          kind: "sale",
          sale: {
            customerExternalId: customer.externalId,
            invoiceId,
            amount,
            ok: true,
          },
        };
      } catch (error) {
        return {
          kind: "sale",
          sale: {
            customerExternalId: customer.externalId,
            invoiceId,
            amount,
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          },
        };
      }
    },
  );

  const renewals: SaleResult[] = [];
  const churns: ChurnResult[] = [];
  for (const result of renewalResults) {
    if (result?.kind === "sale") {
      renewals.push(result.sale);
    } else if (result?.kind === "churn") {
      churns.push(result.churn);
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
    churns,
  });
}
