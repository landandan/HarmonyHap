/** Small Markdown helpers. Critical for safe rendering of third-party text. */

export function escapeTableCell(s: string | null | undefined): string {
  if (!s) return '';
  return String(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncate(s: string | null | undefined, n: number): string {
  if (!s) return '';
  const t = String(s).replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  return t.slice(0, n).trimEnd() + '…';
}

/** Escape Markdown punctuation that could break formatting. */
export function escapeMarkdown(s: string): string {
  return s.replace(/([\\`*_{}\[\]()#+\-.!])/g, '\\$1');
}
