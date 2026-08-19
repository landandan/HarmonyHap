import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function fileExists(p: string): Promise<boolean> {
  try {
    const stat = await fs.stat(p);
    return stat.isFile();
  } catch {
    return false;
  }
}

/** Read + parse JSON. Throws on missing file or invalid JSON. */
export async function readJson<T = unknown>(p: string): Promise<T> {
  const raw = await fs.readFile(p, 'utf8');
  return JSON.parse(raw) as T;
}

/**
 * Write JSON with stable formatting:
 *  - 2-space indent
 *  - trailing newline
 *  - insertion-ordered keys (caller controls order)
 * Arrays are sorted by the caller before passing in.
 */
export async function writeJson(p: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(p));
  const text = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(p, text, 'utf8');
}

/** Load a YAML file and parse it. */
export async function readYaml<T = unknown>(p: string): Promise<T> {
  const raw = await fs.readFile(p, 'utf8');
  const parsed = yaml.load(raw);
  if (parsed === undefined || parsed === null) {
    throw new Error(`YAML file is empty or invalid: ${p}`);
  }
  return parsed as T;
}

export async function readText(p: string): Promise<string> {
  return fs.readFile(p, 'utf8');
}

export async function writeText(p: string, text: string): Promise<void> {
  await ensureDir(path.dirname(p));
  await fs.writeFile(p, text, 'utf8');
}

/** Read a file if present, otherwise return a fallback. */
export async function readTextOptional(p: string, fallback = ''): Promise<string> {
  if (await fileExists(p)) return fs.readFile(p, 'utf8');
  return fallback;
}
