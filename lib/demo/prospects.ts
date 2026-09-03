import {
  CUSTOMERS,
  PARTNERS,
  TRIAL_CUSTOMERS,
  countryAt,
  saleAmountCents,
  type DemoCustomer,
  type PlanName,
} from "./catalog";

/** First day of the historical backfill. Cron renewals look back to this date. */
const DEMO_ACTIVITY_START = Date.UTC(2026, 7, 3);

/** First day the live activity cron started. Do not change — existing cron customers use this epoch. */
const DEMO_SEQUENCE_EPOCH = Date.UTC(2026, 8, 1);

type Prospect = { name: string; slug: string; contact: string };

const PROSPECTS: Prospect[] = [
  { name: "Oakridge Systems", slug: "oakridge", contact: "alex.rivera" },
  { name: "Fieldstone Labs", slug: "fieldstone", contact: "priya.shah" },
  { name: "Silverpine Collective", slug: "silverpine", contact: "marcus.hale" },
  { name: "Harbor & Pine", slug: "harborpine", contact: "elena.vasquez" },
  { name: "Nimbus Freight", slug: "nimbus", contact: "owen.castillo" },
  { name: "Copperline Studio", slug: "copperline", contact: "nina.park" },
  { name: "Westbrook Analytics", slug: "westbrook", contact: "james.okoye" },
  { name: "Lumen Arc", slug: "lumenarc", contact: "sara.lindqvist" },
  { name: "Redwood Supply Co.", slug: "redwood", contact: "diego.mora" },
  { name: "Atlas Thread", slug: "atlasthread", contact: "hannah.cho" },
  { name: "Northglass Media", slug: "northglass", contact: "theo.bennett" },
  { name: "Kindling Health", slug: "kindling", contact: "amira.hassan" },
  { name: "Bramble Logistics", slug: "bramble", contact: "lucas.nguyen" },
  { name: "Summit Quill", slug: "summitquill", contact: "claire.donovan" },
  { name: "Cinder & Co.", slug: "cinder", contact: "rafael.silva" },
  { name: "Polaris Workshop", slug: "polaris", contact: "maya.ikeda" },
  { name: "Lowtide Ventures", slug: "lowtide", contact: "ben.carroll" },
  { name: "Ironwood Partners", slug: "ironwood", contact: "leila.mansour" },
  { name: "Sable & Grove", slug: "sablegrove", contact: "chris.adelman" },
  { name: "Windmere Design", slug: "windmere", contact: "isla.macrae" },
  { name: "Kestrel Software", slug: "kestrel", contact: "noah.bright" },
  { name: "Marble Coast", slug: "marblecoast", contact: "camila.ortiz" },
  { name: "Hearthline Foods", slug: "hearthline", contact: "peter.lang" },
  { name: "Driftwood Legal", slug: "driftwood", contact: "anita.kapoor" },
  { name: "Aurora Binder", slug: "aurorabinder", contact: "felix.wagner" },
  { name: "Pinecroft Labs", slug: "pinecroft", contact: "zoe.hart" },
  { name: "Goldleaf Retail", slug: "goldleaf", contact: "ivan.petrov" },
  { name: "Stormbreak Media", slug: "stormbreak", contact: "ruby.santiago" },
  { name: "Cinderblock Robotics", slug: "cinderblock", contact: "kenji.mori" },
  { name: "Willowbend Studios", slug: "willowbend", contact: "ada.okonkwo" },
  { name: "Farthington Group", slug: "farthington", contact: "simon.reed" },
  { name: "Nightjar Analytics", slug: "nightjar", contact: "lina.berg" },
  { name: "Seabound Consulting", slug: "seabound", contact: "omar.farouk" },
  { name: "Tinderbox Press", slug: "tinderbox", contact: "gwen.foster" },
  { name: "Halcyon Apparel", slug: "halcyon", contact: "mateo.rossi" },
  { name: "Ridgeline Bio", slug: "ridgeline", contact: "nora.klein" },
  { name: "Moss & Meter", slug: "mossmeter", contact: "eli.bauer" },
  { name: "Clearwater Ops", slug: "clearwater", contact: "fatima.zahra" },
  { name: "Emberlane Creative", slug: "emberlane", contact: "hugo.martin" },
  { name: "Stoneharbor Freight", slug: "stoneharbor", contact: "yara.nasser" },
];

const DAILY_PLAN_SETS: PlanName[][] = [
  ["Team", "Starter", "Starter"],
  ["Business", "Team", "Starter"],
  ["Team", "Starter", "Starter"],
  ["Business", "Starter", "Starter"],
];

const NEW_CUSTOMERS_PER_DAY = 3;

/**
 * Backfill sequence indices are offset far past anything the live cron will
 * reach, so historical (Aug) prospects never collide with real cron-created
 * customers on/after DEMO_SEQUENCE_EPOCH.
 */
const BACKFILL_INDEX_BASE = 1_000_000;

/** A little extra volume for the August backfill only — never used by the live cron. */
const BACKFILL_EXTRA_CUSTOMERS_PER_DAY = 1;
const BACKFILL_EXTRA_INDEX_BASE = 2_000_000;
const BACKFILL_EXTRA_PLAN_SETS: PlanName[][] = [
  ["Starter"],
  ["Team"],
  ["Starter"],
  ["Business"],
];

const STEMS = [
  "Willow",
  "Cedar",
  "Maple",
  "Aspen",
  "Juniper",
  "Hemlock",
  "Laurel",
  "Alder",
  "Rowan",
  "Birch",
  "Hawthorn",
  "Sycamore",
  "Magnolia",
  "Cypress",
  "Poplar",
  "Spruce",
  "Fir",
  "Elm",
  "Ash",
  "Beech",
];

const KINDS = [
  "Systems",
  "Labs",
  "Studio",
  "Media",
  "Freight",
  "Analytics",
  "Health",
  "Logistics",
  "Workshop",
  "Ventures",
  "Design",
  "Software",
  "Legal",
  "Retail",
  "Robotics",
  "Consulting",
  "Press",
  "Bio",
  "Creative",
  "Ops",
];

const REGIONS = [
  "North",
  "West",
  "East",
  "South",
  "Pacific",
  "Atlantic",
  "Highland",
  "Coastal",
];

const FIRST_NAMES = [
  "alex",
  "priya",
  "marcus",
  "elena",
  "owen",
  "nina",
  "james",
  "sara",
  "diego",
  "hannah",
  "theo",
  "amira",
  "lucas",
  "claire",
  "rafael",
  "maya",
];

const LAST_NAMES = [
  "rivera",
  "shah",
  "hale",
  "vasquez",
  "castillo",
  "park",
  "okoye",
  "lindqvist",
  "mora",
  "cho",
  "bennett",
  "hassan",
  "nguyen",
  "donovan",
  "silva",
  "ikeda",
];

export function dailyNewCustomers(date = new Date()): DemoCustomer[] {
  const dayIndex = utcDayIndex(date);
  const dateKey = utcDateKey(date);
  const plans = DAILY_PLAN_SETS[dayIndex % DAILY_PLAN_SETS.length];

  return Array.from({ length: NEW_CUSTOMERS_PER_DAY }, (_, offset) => {
    const sequence = sequenceIndex(date, offset);
    const prospect = prospectAt(sequence);
    const plan = plans[offset];
    const partner = PARTNERS[(dayIndex + offset) % PARTNERS.length];

    return {
      name: prospect.name,
      slug: prospect.slug,
      email: emailOf(prospect),
      externalId: `cus_${prospect.slug}_${dateKey}`,
      partnerUsername: partner.username,
      plan,
      seats: seatsFor(plan, dayIndex + offset),
      country: countryAt(sequence),
    };
  });
}

/** Extra August-only customers, on top of `dailyNewCustomers`, to give the history backfill a bit more volume. */
export function backfillExtraCustomers(date: Date): DemoCustomer[] {
  const dayIndex = utcDayIndex(date);
  const dateKey = utcDateKey(date);
  const plans =
    BACKFILL_EXTRA_PLAN_SETS[
    ((dayIndex % BACKFILL_EXTRA_PLAN_SETS.length) +
      BACKFILL_EXTRA_PLAN_SETS.length) %
    BACKFILL_EXTRA_PLAN_SETS.length
    ];

  return Array.from(
    { length: BACKFILL_EXTRA_CUSTOMERS_PER_DAY },
    (_, offset) => {
      const sequence =
        BACKFILL_EXTRA_INDEX_BASE +
        dayIndex * BACKFILL_EXTRA_CUSTOMERS_PER_DAY +
        offset;
      const prospect = prospectAt(sequence);
      const plan = plans[offset];
      const partner =
        PARTNERS[
        (((dayIndex + offset + 1) % PARTNERS.length) + PARTNERS.length) %
        PARTNERS.length
        ];

      return {
        name: prospect.name,
        slug: prospect.slug,
        email: emailOf(prospect),
        externalId: `cus_${prospect.slug}_${dateKey}_x`,
        partnerUsername: partner.username,
        plan,
        seats: seatsFor(plan, dayIndex + offset + 7),
        country: countryAt(sequence),
      };
    },
  );
}

export function generatedCustomersToRenew(now = new Date()): DemoCustomer[] {
  const due: DemoCustomer[] = [];

  for (let monthsAgo = 1; monthsAgo <= 24; monthsAgo++) {
    const past = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() - monthsAgo,
        now.getUTCDate(),
      ),
    );

    if (past.getTime() < DEMO_ACTIVITY_START) {
      break;
    }

    if (past.getUTCDate() !== now.getUTCDate()) {
      continue;
    }

    for (const customer of [
      ...dailyNewCustomers(past),
      ...backfillExtraCustomers(past),
    ]) {
      if (saleAmountCents(customer) !== null) {
        due.push(customer);
      }
    }
  }

  return due;
}

export function utcDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function emailOf(prospect: Prospect) {
  return `${prospect.contact}@${prospect.slug}.com`;
}

function rawProspect(index: number): Prospect {
  if (index < PROSPECTS.length) {
    return PROSPECTS[index];
  }

  return synthesizeProspect(index - PROSPECTS.length);
}

function prospectAt(index: number): Prospect {
  const catalog = [...CUSTOMERS, ...TRIAL_CUSTOMERS];
  const reservedEmails = new Set(
    catalog.map((customer) => customer.email.toLowerCase()),
  );
  const reservedSlugs = new Set(catalog.map((customer) => customer.slug));

  let current: Prospect | undefined;
  for (let i = 0; i <= index; i++) {
    current = uniquify(rawProspect(i), reservedEmails, reservedSlugs);
    reservedEmails.add(emailOf(current).toLowerCase());
    reservedSlugs.add(current.slug);
  }

  if (!current) {
    throw new Error(`Failed to allocate a unique prospect at index ${index}`);
  }

  return current;
}

function uniquify(
  prospect: Prospect,
  reservedEmails: Set<string>,
  reservedSlugs: Set<string>,
): Prospect {
  if (isAvailable(prospect, reservedEmails, reservedSlugs)) {
    return prospect;
  }

  for (let suffix = 2; suffix < 10_000; suffix++) {
    const next = { ...prospect, slug: `${prospect.slug}${suffix}` };
    if (isAvailable(next, reservedEmails, reservedSlugs)) {
      return next;
    }
  }

  throw new Error(`Could not allocate a unique email for ${prospect.name}`);
}

function isAvailable(
  prospect: Prospect,
  reservedEmails: Set<string>,
  reservedSlugs: Set<string>,
) {
  return (
    !reservedSlugs.has(prospect.slug) &&
    !reservedEmails.has(emailOf(prospect).toLowerCase())
  );
}

function synthesizeProspect(index: number): Prospect {
  const stem = STEMS[index % STEMS.length];
  const kind = KINDS[Math.floor(index / STEMS.length) % KINDS.length];
  const region =
    REGIONS[Math.floor(index / (STEMS.length * KINDS.length)) % REGIONS.length];
  const wave = Math.floor(
    index / (STEMS.length * KINDS.length * REGIONS.length),
  );

  const name =
    wave === 0
      ? `${region} ${stem} ${kind}`
      : `${region} ${stem} ${kind} ${wave + 1}`;
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last =
    LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];

  return {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, ""),
    contact: `${first}.${last}`,
  };
}

function sequenceIndex(date: Date, offset: number) {
  const day = utcDayIndex(date);
  const cronEpoch = Math.floor(DEMO_SEQUENCE_EPOCH / 86_400_000);

  if (day >= cronEpoch) {
    return (day - cronEpoch) * NEW_CUSTOMERS_PER_DAY + offset;
  }

  const backfillEpoch = Math.floor(DEMO_ACTIVITY_START / 86_400_000);
  return (
    BACKFILL_INDEX_BASE +
    Math.max(0, day - backfillEpoch) * NEW_CUSTOMERS_PER_DAY +
    offset
  );
}

function utcDayIndex(date: Date) {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

function seatsFor(plan: PlanName, salt: number) {
  if (plan === "Starter") {
    return 2;
  }
  if (plan === "Team") {
    return 4 + (salt % 5);
  }
  return 8 + (salt % 7);
}
