/**
 * Runs `worker` over `items` with at most `concurrency` in flight at once,
 * preserving each result's position in the returned array. Used so the
 * cron (and backfill) can push through the higher organic volumes without
 * running every click/lead/sale call fully sequentially.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, run),
  );

  return results;
}
