import { Dub } from "dub";

export const DUB_API_BASE_URL = "https://api.dub.co";

export function createDubClient() {
  const token = process.env.DUB_API_KEY;
  if (!token) {
    throw new Error("Missing DUB_API_KEY");
  }

  return new Dub({
    token,
    timeoutMs: 60_000,
  });
}
