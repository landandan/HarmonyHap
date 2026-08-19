export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let globalLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

export function setLogLevel(level: LogLevel): void {
  globalLevel = level;
}

export function getLogLevel(): LogLevel {
  return globalLevel;
}

/**
 * Lightweight leveled logger. Emits `[LEVEL] [SCOPE] message`.
 * Never writes to README / generated output files.
 */
export class Logger {
  constructor(private readonly scope: string) {}

  private emit(level: LogLevel, message: string): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[globalLevel]) return;
    const ts = new Date().toISOString();
    const line = `[${level.toUpperCase()}] [${this.scope}] ${message}`;
    if (level === 'error') {
      console.error(line);
    } else if (level === 'warn') {
      console.warn(line);
    } else {
      // Use stderr for diagnostics so stdout can stay clean for machine output.
      console.error(line);
    }
    void ts;
  }

  info(message: string): void {
    this.emit('info', message);
  }
  warn(message: string): void {
    this.emit('warn', message);
  }
  error(message: string): void {
    this.emit('error', message);
  }
  debug(message: string): void {
    this.emit('debug', message);
  }
}
