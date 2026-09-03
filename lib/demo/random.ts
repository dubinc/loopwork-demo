/**
 * Deterministic pseudo-random helpers, so "organic" demo data (varying
 * click/lead/sale counts per day) still reproduces the same numbers on
 * repeated reads for the same seed — only actually varies when the seed
 * (e.g. the date) changes.
 */

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic pseudo-random float in [0, 1) for a given seed string. */
export function seededRandom(seed: string): number {
  const x = Math.sin(hashSeed(seed)) * 10000;
  return x - Math.floor(x);
}

/** Deterministic pseudo-random integer in [min, max] (inclusive) for a given seed string. */
export function seededInt(seed: string, min: number, max: number): number {
  return min + Math.floor(seededRandom(seed) * (max - min + 1));
}
