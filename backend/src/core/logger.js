import { nowIso } from '../utils/time.js';
import { createId } from '../utils/id.js';

export const logLevels = ['silent', 'error', 'warn', 'info', 'debug'];

export class Logger {
  constructor(level = 'info', sink = console) {
    this.level = logLevels.includes(level) ? level : 'info';
    this.sink = sink;
    this.records = [];
  }

  canWrite(level) {
    const target = logLevels.indexOf(this.level);
    const current = logLevels.indexOf(level);
    if (target < 0 || current < 0) {
      return false;
    }
    return current <= target;
  }

  format(level, message, context = {}) {
    return {
      id: createId('log'),
      level,
      message,
      context,
      timestamp: nowIso()
    };
  }

  push(level, message, context = {}) {
    const record = this.format(level, message, context);
    this.records.push(record);
    if (this.canWrite(level) && this.sink && typeof this.sink.log === 'function') {
      this.sink.log(`[${record.timestamp}] ${level.toUpperCase()} ${message}`);
    }
    return record;
  }

  debug(message, context = {}) {
    return this.push('debug', message, context);
  }

  info(message, context = {}) {
    return this.push('info', message, context);
  }

  warn(message, context = {}) {
    return this.push('warn', message, context);
  }

  error(message, context = {}) {
    return this.push('error', message, context);
  }

  list(limit = 50) {
    return [...this.records].slice(-limit).reverse();
  }

  clear() {
    this.records.length = 0;
  }

  countByLevel() {
    return this.records.reduce((acc, record) => {
      acc[record.level] = (acc[record.level] || 0) + 1;
      return acc;
    }, {});
  }

  summary() {
    const counts = this.countByLevel();
    return {
      total: this.records.length,
      counts,
      lastMessage: this.records.at(-1) || null
    };
  }
}
