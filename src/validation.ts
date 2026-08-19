import * as path from 'node:path';
import {
  repositoriesFileSchema,
  statisticsSchema,
  categoriesFileSchema,
  organizationsFileSchema,
} from './schemas/repository.js';
import { fileExists, readText } from './utils/io.js';
import { Logger } from './utils/logger.js';
import type { PipelineState } from './pipeline/state.js';

const log = new Logger('VALIDATE');

/**
 * Validate generated data + docs. Throws if anything is invalid so the
 * GitHub Action fails instead of publishing broken data.
 */
export async function validateOutputs(state: PipelineState): Promise<void> {
  const errors: string[] = [];

  // ---- data files ----
  const reposRaw = await state.readDataFile<unknown>('repositories.json');
  if (!reposRaw) {
    errors.push('data/repositories.json is missing');
  } else {
    try {
      const parsed = repositoriesFileSchema.parse(reposRaw);
      const names = parsed.repositories.map((r) => r.full_name);
      const seen = new Set<string>();
      const dups = new Set<string>();
      for (const n of names) {
        if (seen.has(n)) dups.add(n);
        seen.add(n);
      }
      if (dups.size > 0) errors.push(`duplicate full_name: ${Array.from(dups).join(', ')}`);
      for (const r of parsed.repositories) {
        if (!/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(r.url)) {
          errors.push(`invalid GitHub URL for ${r.full_name}: ${r.url}`);
        }
        if (r.status === 'indexed' && r.hap.status !== 'binary' && r.hap.status !== 'buildable') {
          errors.push(`indexed but hap.status=${r.hap.status}: ${r.full_name}`);
        }
        if (r.hap.status === 'binary' && !r.hap.package_types.includes('HAP')) {
          errors.push(`binary without HAP package type: ${r.full_name}`);
        }
      }
    } catch (e) {
      errors.push(`data/repositories.json schema error: ${(e as Error).message}`);
    }
  }

  for (const f of ['statistics.json', 'categories.json', 'organizations.json']) {
    const raw = await state.readDataFile<unknown>(f);
    if (!raw) {
      errors.push(`data/${f} is missing`);
      continue;
    }
    try {
      if (f === 'statistics.json') statisticsSchema.parse(raw);
      else if (f === 'categories.json') categoriesFileSchema.parse(raw);
      else organizationsFileSchema.parse(raw);
    } catch (e) {
      errors.push(`data/${f} schema error: ${(e as Error).message}`);
    }
  }

  // ---- generated docs ----
  for (const f of ['README.md', 'ai-context.md', 'llms.txt', 'llms-full.txt']) {
    const p = path.join(state.generatedDir, f);
    if (!(await fileExists(p))) {
      errors.push(`generated/${f} is missing`);
      continue;
    }
    const txt = await readText(p);
    if (/\bundefined\b/.test(txt)) errors.push(`generated/${f} contains "undefined"`);
    if (/\bNaN\b/.test(txt)) errors.push(`generated/${f} contains "NaN"`);
    // "null" as a leaked value (e.g. table cell) is not allowed.
    if (/\| ?null ?\|/.test(txt) || /: null\b/.test(txt)) {
      errors.push(`generated/${f} contains leaked "null"`);
    }
    if (txt.trim().length === 0) errors.push(`generated/${f} is empty`);
  }

  if (errors.length > 0) {
    for (const e of errors) log.error(e);
    throw new Error(`Validation failed with ${errors.length} issue(s)`);
  }
  log.info('validation passed');
}
