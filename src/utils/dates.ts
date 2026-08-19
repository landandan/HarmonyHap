/** Date helpers. All internal time is UTC; display as YYYY-MM-DD. */

export function nowUtcIso(): string {
  return new Date().toISOString();
}

/** Returns YYYY-MM-DD in UTC. */
export function toDateOnly(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toISOString().slice(0, 10);
}

/** Whole days between `iso` and `now` (UTC). Returns a large number for invalid input. */
export function daysSince(iso: string | undefined | null, now: Date = new Date()): number {
  if (!iso) return 999999;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 999999;
  return Math.max(0, Math.floor((now.getTime() - then) / 86_400_000));
}

/** Count repositories whose pushed_at is within `days` of `now`. */
export function countUpdatedWithin(
  items: Array<{ pushed_at: string }>,
  days: number,
  now: Date = new Date(),
): number {
  const cutoff = now.getTime() - days * 86_400_000;
  return items.filter((it) => new Date(it.pushed_at).getTime() >= cutoff).length;
}
