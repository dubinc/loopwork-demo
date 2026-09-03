import type { DemoCustomer } from "./catalog";
import { DUB_API_BASE_URL } from "./dub";

export async function createDemoCommission({
  domain,
  key,
  date,
  type,
  customer,
  sale,
  referrer,
  userAgent,
  country,
}: {
  domain: string;
  key: string;
  date: Date | string;
  type: "lead" | "sale";
  customer: Pick<DemoCustomer, "name" | "email" | "externalId" | "country">;
  sale?: {
    amount: number;
    invoiceId?: string;
    eventName?: string;
  };
  referrer?: string;
  userAgent?: string;
  country?: string;
}) {
  const secret = process.env.DEMO_CLICK_SECRET;
  if (!secret) {
    throw new Error("Missing DEMO_CLICK_SECRET");
  }

  const clickCountry = country ?? customer.country;
  const eventDate = typeof date === "string" ? date : date.toISOString();

  const response = await fetch(`${DUB_API_BASE_URL}/demo/commission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      domain,
      key,
      date: eventDate,
      type,
      country: clickCountry,
      referrer,
      userAgent,
      customer: {
        name: customer.name,
        email: customer.email,
        externalId: customer.externalId,
        country: customer.country,
      },
      ...(type === "sale" && sale ? { sale } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `POST /demo/commission failed (${response.status}): ${await response.text()}`,
    );
  }

  const data = (await response.json()) as {
    clickId?: string;
    customerId?: string;
  };

  if (!data.clickId || !data.customerId) {
    throw new Error("POST /demo/commission did not return clickId and customerId");
  }

  return { clickId: data.clickId, customerId: data.customerId };
}
