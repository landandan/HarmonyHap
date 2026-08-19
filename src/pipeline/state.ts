import * as path from 'node:path';
import * as fs from 'node:fs';
import { readJson, writeJson, writeText, fileExists, ensureDir } from '../utils/io.js';
import { Logger } from '../utils/logger.js';
import type {
  AnalysisStage,
  AnalysisState,
  DiscoveredItem,
  DiscoveredState,
  RepoAnalysis,
} from './types.js';

const log = new Logger('STATE');

const SCHEMA_VERSION = 1;

/**
 * Persistent state store. Reads/writes intermediate JSON files under `workDir`
 * (default data/.work). The final outputs go to `data/` and `generated/`.
 */
export class PipelineState {
  constructor(
    public readonly workDir: string = 'data/.work',
    public readonly dataDir: string = 'data',
    public readonly generatedDir: string = 'generated',
  ) {}

  private workFile(name: string): string {
    return path.join(this.workDir, name);
  }

  async init(): Promise<void> {
    await ensureDir(this.workDir);
    await ensureDir(this.dataDir);
    await ensureDir(this.generatedDir);
  }

  // ---- discovered ----
  async writeDiscovered(items: DiscoveredItem[], generatedAt: string): Promise<void> {
    const state: DiscoveredState = {
      schema_version: SCHEMA_VERSION,
      generated_at: generatedAt,
      items,
    };
    await writeJson(this.workFile('discovered.json'), state);
    log.info(`discovered ${items.length} candidate repositories`);
  }

  async readDiscovered(): Promise<DiscoveredItem[]> {
    const p = this.workFile('discovered.json');
    if (!(await fileExists(p))) return [];
    const state = await readJson<DiscoveredState>(p);
    return state.items ?? [];
  }

  // ---- analysis stages ----
  async writeAnalysis(
    items: RepoAnalysis[],
    stage: AnalysisStage,
    generatedAt: string,
  ): Promise<void> {
    const state: AnalysisState = {
      schema_version: SCHEMA_VERSION,
      generated_at: generatedAt,
      stage,
      items,
    };
    await writeJson(this.workFile(`${stage}.json`), state);
    log.info(`stage ${stage}: ${items.length} repositories`);
  }

  async readAnalysis(stage: AnalysisStage): Promise<RepoAnalysis[]> {
    const p = this.workFile(`${stage}.json`);
    if (!(await fileExists(p))) return [];
    const state = await readJson<AnalysisState>(p);
    return state.items ?? [];
  }

  /** Synchronous variant (used by the sync normalize stage). */
  readAnalysisSync(stage: AnalysisStage): RepoAnalysis[] {
    const p = this.workFile(`${stage}.json`);
    if (!fs.existsSync(p)) return [];
    const state = JSON.parse(fs.readFileSync(p, 'utf8')) as AnalysisState;
    return state.items ?? [];
  }

  // ---- final data outputs ----
  async writeDataFile(name: string, data: unknown): Promise<void> {
    await writeJson(path.join(this.dataDir, name), data);
  }

  async readDataFile<T>(name: string): Promise<T | null> {
    const p = path.join(this.dataDir, name);
    if (!(await fileExists(p))) return null;
    return readJson<T>(p);
  }

  // ---- generated docs ----
  async writeGenerated(name: string, content: string): Promise<void> {
    await writeText(path.join(this.generatedDir, name), content);
  }
}
