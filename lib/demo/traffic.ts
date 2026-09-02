export const REFERRERS = [
  "https://youtube.com",
  "https://instagram.com",
  "https://tiktok.com",
  "(direct)",
] as const;

export function referrerAt(index: number) {
  return REFERRERS[index % REFERRERS.length];
}
