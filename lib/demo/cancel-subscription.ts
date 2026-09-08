import { DUB_API_BASE_URL } from "./dub";

/**
 * Marks a demo customer as churned in Dub. Uses the REST API directly so we
 * can send `subscriptionCanceledAt` before the generated SDK picks up the
 * new PATCH field.
 */
export async function cancelCustomerSubscription(
  externalId: string,
  canceledAt = new Date(),
) {
  const token = process.env.DUB_API_KEY;
  if (!token) {
    throw new Error("Missing DUB_API_KEY");
  }

  const response = await fetch(`${DUB_API_BASE_URL}/customers/ext_${externalId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriptionCanceledAt: canceledAt.toISOString(),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `PATCH /customers failed (${response.status}): ${await response.text()}`,
    );
  }
}
