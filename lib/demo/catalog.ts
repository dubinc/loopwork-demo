import { PRICING_PLANS } from "../content";

export type PlanName = (typeof PRICING_PLANS)[number]["name"];

export type DemoPartner = {
  name: string;
  email: string;
  username: string;
  tenantId: string;
  description?: string;
};

export type DemoCustomer = {
  name: string;
  slug: string;
  email: string;
  externalId: string;
  partnerUsername: string;
  plan: PlanName;
  seats: number;
  country: string;
  /** Day of month (1–28) the subscription invoices. Starter has none. */
  billingDay?: number;
};

export const CUSTOMER_COUNTRIES = [
  "US",
  "GB",
  "CA",
  "DE",
  "AU",
  "NL",
  "FR",
  "BR",
  "JP",
  "SG",
  "IE",
  "ES",
  "SE",
  "IN",
  "MX",
  "IT",
  "KR",
  "NZ",
  "CH",
  "PT",
] as const;

export function countryAt(index: number) {
  return CUSTOMER_COUNTRIES[index % CUSTOMER_COUNTRIES.length];
}

export const PARTNERS: DemoPartner[] = [
  {
    name: "Maya Chen",
    email: "maya@loopwork.link",
    username: "maya",
    tenantId: "lw_maya",
  },
  {
    name: "Jordan Ellis",
    email: "jordan@loopwork.link",
    username: "jordan",
    tenantId: "lw_jordan",
  },
  {
    name: "Trevor Whitman",
    email: "trevor@loopwork.link",
    username: "trevor",
    tenantId: "lw_trevor",
  },
  {
    name: "Liam O'Connor",
    email: "liam@loopwork.link",
    username: "liam",
    tenantId: "lw_liam",
  },
  {
    name: "Priya Anand",
    email: "priya@loopwork.link",
    username: "priya",
    tenantId: "lw_priya",
    description: "Anand Growth Partners",
  },
  {
    name: "Diego Fernandez",
    email: "diego@loopwork.link",
    username: "diego",
    tenantId: "lw_diego",
    description: "Bright Path Consulting",
  },
  {
    name: "Sofia Marín",
    email: "sofia@loopwork.link",
    username: "sofia",
    tenantId: "lw_sofia",
    description: "Marín Digital",
  },
  {
    name: "Grace Kim",
    email: "grace@loopwork.link",
    username: "grace",
    tenantId: "lw_grace",
    description: "NovaReach Media",
  },
];

export const TRIAL_CUSTOMERS: DemoCustomer[] = [
  customer("Dune & Co.", "dune", "maya", "Starter", 2),
  customer("Paperkite Studio", "paperkite", "jordan", "Starter", 2),
  customer("Lantern House", "lantern", "trevor", "Starter", 2),
  customer("Softwood Supply", "softwood", "liam", "Starter", 2),
  customer("Kite & Needle", "kiteneedle", "priya", "Starter", 2),
  customer("Riverbed Films", "riverbed", "diego", "Starter", 2),
  customer("Glasshouse PR", "glasshouse", "sofia", "Starter", 2),
  customer("Foldline Studio", "foldline", "grace", "Starter", 2),
];

export const CUSTOMERS: DemoCustomer[] = [
  customer("Harborline Studios", "harborline", "maya", "Team", 6, 2),
  customer("Northwind Apparel", "northwind", "maya", "Starter", 2),
  customer("Cedar & Co.", "cedar", "jordan", "Team", 5, 4),
  customer("Fernwood Design Co.", "fernwood", "jordan", "Starter", 2),
  customer("Solstice Marketing", "solstice", "trevor", "Team", 8, 5),
  customer("Coastal Bloom", "coastal", "trevor", "Starter", 3),
  customer("Quill & Ink Publishing", "quill", "liam", "Team", 5, 7),
  customer("Rosewood Realty Group", "rosewood", "liam", "Team", 6, 8),
  customer("BrightForge Media", "brightforge", "priya", "Business", 12, 10),
  customer("Aldergate Consulting", "aldergate", "priya", "Business", 8, 11),
  customer("Amberlight Studios", "amberlight", "priya", "Team", 3, 13),
  customer("Vantage Robotics", "vantage", "diego", "Business", 10, 14),
  customer("Pinnacle Logistics", "pinnacle", "diego", "Business", 15, 16),
  customer("Craft & Table Hospitality", "craft", "diego", "Team", 7, 17),
  customer("Meridian Health Partners", "meridian", "sofia", "Business", 20, 19),
  customer("TrueNorth Analytics", "truenorth", "sofia", "Business", 9, 20),
  customer("Skyline Ventures", "skyline", "sofia", "Team", 6, 22),
  customer("Ironclad Legal Group", "ironclad", "grace", "Business", 11, 23),
  customer("Bluepeak Software", "bluepeak", "grace", "Business", 14, 25),
  customer("Vertex Robotics", "vertex", "grace", "Business", 10, 27),
];

export function planPriceCents(plan: PlanName): number {
  const row = PRICING_PLANS.find((p) => p.name === plan);
  if (!row) {
    throw new Error(`Unknown plan: ${plan}`);
  }

  const dollars = Number(row.price.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(dollars)) {
    throw new Error(`Could not parse price for plan ${plan}: ${row.price}`);
  }

  return Math.round(dollars * 100);
}

export function saleAmountCents(customer: DemoCustomer): number | null {
  const unit = planPriceCents(customer.plan);
  if (unit === 0) {
    return null;
  }

  return customer.seats * unit;
}

export function payingCustomers(): DemoCustomer[] {
  return CUSTOMERS.filter((entry) => saleAmountCents(entry) !== null);
}

export function customersDueOn(date = new Date()): DemoCustomer[] {
  const day = date.getUTCDate();
  return payingCustomers().filter((entry) => entry.billingDay === day);
}

function customer(
  name: string,
  slug: string,
  partnerUsername: string,
  plan: PlanName,
  seats: number,
  billingDay?: number,
): DemoCustomer {
  return {
    name,
    slug,
    email: `${slug}@loopwork.link`,
    externalId: `cus_${slug}`,
    partnerUsername,
    plan,
    seats,
    country: countryFromSlug(slug),
    billingDay,
  };
}

function countryFromSlug(slug: string) {
  let hash = 0;
  for (const character of slug) {
    hash += character.charCodeAt(0);
  }
  return countryAt(hash);
}
