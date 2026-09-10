import { DUB_API_BASE_URL } from "./dub";

export type WorkspaceCustomer = {
  id: string;
  name?: string | null;
  email?: string | null;
  externalId: string;
  country?: string | null;
  sales?: number | null;
  saleAmount?: number | null;
  firstSaleAt?: string | null;
  subscriptionCanceledAt?: string | null;
  link?: {
    domain: string;
    key: string;
  } | null;
};

/** Every customer in the Dub workspace, including referral link fields. */
export async function listWorkspaceCustomers() {
  const token = process.env.DUB_API_KEY;
  if (!token) {
    throw new Error("Missing DUB_API_KEY");
  }

  const customers: WorkspaceCustomer[] = [];
  let page = 1;

  for (; ;) {
    const url = new URL(`${DUB_API_BASE_URL}/customers`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("includeExpandedFields", "true");
    url.searchParams.set("sortBy", "createdAt");
    url.searchParams.set("sortOrder", "asc");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(
        `GET /customers failed (${response.status}): ${await response.text()}`,
      );
    }

    const batch = (await response.json()) as WorkspaceCustomer[];
    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    customers.push(...batch);
    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return customers;
}
