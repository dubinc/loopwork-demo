import { SITE_URL } from "../site";
import { DUB_API_BASE_URL } from "./dub";

export const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
];

export function userAgentAt(index: number) {
  const template = USER_AGENTS[index % USER_AGENTS.length];
  return template
    .replace(/Chrome\/[\d.]+/, `Chrome/124.0.${index}.0`)
    .replace(/Firefox\/[\d.]+/, `Firefox/${120 + (index % 12)}.0`)
    .replace(/Version\/[\d.]+/, `Version/17.${index % 8}`);
}

export async function trackClick(
  domain: string,
  key: string,
  userAgent = USER_AGENTS[0],
) {
  const response = await fetch(`${DUB_API_BASE_URL}/track/click`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: SITE_URL,
      Origin: SITE_URL,
      "User-Agent": userAgent,
    },
    body: JSON.stringify({ domain, key }),
  });

  if (!response.ok) {
    throw new Error(
      `POST /track/click failed (${response.status}): ${await response.text()}`,
    );
  }

  const data = (await response.json()) as { clickId?: string };
  if (!data.clickId) {
    throw new Error("POST /track/click did not return a clickId");
  }

  return data.clickId;
}

export async function recordBrowseClicks(
  domain: string,
  key: string,
  count: number,
  uaOffset = 0,
) {
  const clickIds: string[] = [];
  for (let index = 0; index < count; index++) {
    clickIds.push(await trackClick(domain, key, userAgentAt(uaOffset + index)));
  }
  return clickIds;
}
