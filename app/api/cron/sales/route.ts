import { customersDueOn, saleAmountCents } from "@/lib/demo/catalog";
import { createDubClient } from "@/lib/demo/dub";
import { monthlyInvoiceId, trackSubscriptionSale } from "@/lib/demo/sales";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dub = createDubClient();
  const dueToday = customersDueOn();
  const results: Array<{
    customerExternalId: string;
    invoiceId: string;
    amount: number;
    billingDay?: number;
    ok: boolean;
    error?: string;
  }> = [];

  for (const customer of dueToday) {
    const amount = saleAmountCents(customer);
    const invoiceId = monthlyInvoiceId(customer.externalId);

    if (amount === null) {
      continue;
    }

    try {
      await trackSubscriptionSale({
        dub,
        customer,
        eventName: "Invoice paid",
      });
      results.push({
        customerExternalId: customer.externalId,
        invoiceId,
        amount,
        billingDay: customer.billingDay,
        ok: true,
      });
    } catch (error) {
      results.push({
        customerExternalId: customer.externalId,
        invoiceId,
        amount,
        billingDay: customer.billingDay,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return NextResponse.json({
    billingDay: new Date().getUTCDate(),
    due: dueToday.length,
    tracked: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  });
}
