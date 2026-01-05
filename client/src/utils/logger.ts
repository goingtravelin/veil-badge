
// LOGGER UTILITY - Infrastructure Layer

//
// Architecture:

// - Domain layer remains pure (no logging)

import { ILoggerPort, LogLevel } from '../application/ports';

export { LogLevel } from '../application/ports';

interface LoggerConfig {
  defaultLevel: LogLevel;
  moduleOverrides?: Record<string, LogLevel>;
  enableTimestamps?: boolean;
  enableColors?: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  defaultLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableTimestamps: true,
  enableColors: true,
};

// Global configuration
let globalConfig: LoggerConfig = { ...DEFAULT_CONFIG };

// ANSI color codes for browser console
const COLORS = {
  DEBUG: '#808080', // Gray
  INFO: '#2196F3',  // Blue
  WARN: '#FF9800',  // Orange
  ERROR: '#F44336', // Red
  RESET: '',
};

export function configureLogger(config: Partial<LoggerConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

export function configureLoggerFromEnv(): void {
  const envLogLevel = import.meta.env.VITE_LOG_LEVEL;
  if (!envLogLevel) return;

  const moduleOverrides: Record<string, LogLevel> = {};

  const parts = envLogLevel.split(',');

  for (const part of parts) {
    const [module, levelStr] = part.includes(':') ? part.split(':') : ['', part];
    const level = LogLevel[levelStr.toUpperCase() as keyof typeof LogLevel];

    if (level !== undefined) {
      if (module) {
        moduleOverrides[module] = level;
      } else {
        globalConfig.defaultLevel = level;
      }
    }
  }

  if (Object.keys(moduleOverrides).length > 0) {
    globalConfig.moduleOverrides = moduleOverrides;
  }
}

export class Logger implements ILoggerPort {
  constructor(private moduleName: string) {}

  private getLogLevel(): LogLevel {
    return globalConfig.moduleOverrides?.[this.moduleName] ?? globalConfig.defaultLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.getLogLevel();
  }

  private formatMessage(...args: unknown[]): unknown[] {
    const timestamp = globalConfig.enableTimestamps
      ? new Date().toISOString().slice(11, 23) // HH:MM:SS.mmm
      : '';

    const prefix = timestamp
      ? `[${timestamp}] [${this.moduleName}]`
      : `[${this.moduleName}]`;

    return [prefix, ...args];
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatMessage(message, ...args);
    if (globalConfig.enableColors) {
      console.log(`%c${formatted[0]}`, `color: ${COLORS.DEBUG}`, ...formatted.slice(1));
    } else {
      console.log(...formatted);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const formatted = this.formatMessage(message, ...args);
    if (globalConfig.enableColors) {
      console.info(`%c${formatted[0]}`, `color: ${COLORS.INFO}`, ...formatted.slice(1));
    } else {
      console.info(...formatted);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatMessage(message, ...args);
    if (globalConfig.enableColors) {
      console.warn(`%c${formatted[0]}`, `color: ${COLORS.WARN}`, ...formatted.slice(1));
    } else {
      console.warn(...formatted);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formatted = this.formatMessage(message, ...args);
    if (globalConfig.enableColors) {
      console.error(`%c${formatted[0]}`, `color: ${COLORS.ERROR}`, ...formatted.slice(1));
    } else {
      console.error(...formatted);
    }
  }
}

export function createLogger(moduleName: string): Logger {
  return new Logger(moduleName);
}

// Initialize from environment on module load
configureLoggerFromEnv();
