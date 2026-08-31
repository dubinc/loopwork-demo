import { SITE_URL } from "../site";

const TRACK_CLICK_URL = "https://api.dub.co/track/click";

export async function trackClick(domain: string, key: string) {
  const response = await fetch(TRACK_CLICK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: SITE_URL,
      Origin: SITE_URL,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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
