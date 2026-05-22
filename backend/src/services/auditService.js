import { createId } from '../utils/id.js';
import { Logger } from '../core/logger.js';
import { AuditRepository } from '../repositories/auditRepository.js';

export class AuditService {
  constructor(repository = new AuditRepository(), logger = new Logger('debug')) {
    this.repository = repository;
    this.logger = logger;
  }

  recordAction(action, payload = {}) {
    const record = this.repository.addRecord({
      id: createId('audit'),
      action,
      entity: payload.entity || 'system',
      entityId: payload.entityId || '*',
      severity: payload.severity || 'info',
      message: payload.message || action,
      context: payload.context || {}
    });
    this.logger.info(`audit:${action}`, { entity: record.entity, entityId: record.entityId });
    return record;
  }

  traceRequest(requestInfo) {
    const trace = this.repository.addTrace({
      method: requestInfo.method,
      pathname: requestInfo.pathname,
      status: requestInfo.status,
      durationMs: requestInfo.durationMs,
      correlationId: requestInfo.correlationId,
      context: requestInfo.context || {}
    });
    this.logger.debug('trace:request', { pathname: trace.pathname, status: trace.status });
    return trace;
  }

  logSystem(message, context = {}, level = 'info') {
    return this.logger.push(level, message, context);
  }

  getLogSummary() {
    return this.logger.summary();
  }

  getAuditSummary() {
    return {
      records: this.repository.summarizeRecords(),
      traces: this.repository.summarizeTraces(),
      logger: this.logger.summary()
    };
  }

  listLatestRecords(limit = 20) {
    return this.repository.listRecords(limit);
  }

  listLatestTraces(limit = 20) {
    return this.repository.listTraces(limit);
  }

  buildDashboard() {
    const records = this.listLatestRecords(10);
    const traces = this.listLatestTraces(10);
    return {
      totalRecords: this.repository.summarizeRecords().total,
      totalTraces: this.repository.summarizeTraces().total,
      records,
      traces,
      levels: this.logger.countByLevel()
    };
  }

  replay(events = []) {
    return events.map(event => this.recordAction(event.action, event.payload || {}));
  }
}
