import type { Dub } from "dub";
import { PARTNERS, type DemoPartner } from "./catalog";

export type PartnerLink = {
  partner: DemoPartner;
  domain: string;
  key: string;
  shortLink: string;
};

export async function upsertPartnerLink(dub: Dub, partner: DemoPartner) {
  const created = await dub.partners.create({
    name: partner.name,
    email: partner.email,
    username: partner.username,
    tenantId: partner.tenantId,
    description: partner.description ?? null,
  });

  const link =
    created.links?.[0] ??
    (await dub.partners.retrieveLinks({ tenantId: partner.tenantId }))[0];

  if (!link) {
    throw new Error(
      `Partner ${partner.email} was created but has no referral link`,
    );
  }

  return toPartnerLink(partner, link);
}

export async function ensurePartnerLinks(dub: Dub) {
  const links: PartnerLink[] = [];
  for (const partner of PARTNERS) {
    links.push(await upsertPartnerLink(dub, partner));
  }
  return links;
}

export async function getPartnerLinks(dub: Dub) {
  const links: PartnerLink[] = [];

  for (const partner of PARTNERS) {
    try {
      const retrieved = await dub.partners.retrieveLinks({
        tenantId: partner.tenantId,
      });
      if (retrieved[0]) {
        links.push(toPartnerLink(partner, retrieved[0]));
        continue;
      }
    } catch {
      // Partner is missing or has no links yet; create/enroll below.
    }

    links.push(await upsertPartnerLink(dub, partner));
  }

  return links;
}

function toPartnerLink(
  partner: DemoPartner,
  link: { domain: string; key: string; shortLink: string },
): PartnerLink {
  return {
    partner,
    domain: link.domain,
    key: link.key,
    shortLink: link.shortLink,
  };
}
