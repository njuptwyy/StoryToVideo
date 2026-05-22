import { MemoryStore } from './memoryStore.js';
import { createId } from '../utils/id.js';

export class AuditRepository {
  constructor(store = new MemoryStore()) {
    this.store = store;
    this.store.ensureCollection('auditRecords');
    this.store.ensureCollection('requestTraces');
  }

  addRecord(record) {
    return this.store.insert('auditRecords', {
      id: record.id || createId('audit'),
      action: record.action,
      entity: record.entity || 'system',
      entityId: record.entityId || '*',
      severity: record.severity || 'info',
      message: record.message || '',
      context: record.context || {},
      createdAt: record.createdAt || new Date().toISOString()
    });
  }

  addTrace(trace) {
    return this.store.insert('requestTraces', {
      id: trace.id || createId('trace'),
      method: trace.method,
      pathname: trace.pathname,
      status: trace.status || 200,
      durationMs: trace.durationMs || 0,
      correlationId: trace.correlationId || createId('corr'),
      createdAt: trace.createdAt || new Date().toISOString(),
      context: trace.context || {}
    });
  }

  listRecords(limit = 100) {
    return this.store.list('auditRecords').slice(-limit).reverse();
  }

  listTraces(limit = 100) {
    return this.store.list('requestTraces').slice(-limit).reverse();
  }

  groupRecordsBySeverity() {
    return this.listRecords(500).reduce((acc, record) => {
      if (!acc[record.severity]) {
        acc[record.severity] = [];
      }
      acc[record.severity].push(record);
      return acc;
    }, {});
  }

  groupTracesByRoute() {
    return this.listTraces(500).reduce((acc, trace) => {
      const key = `${trace.method}:${trace.pathname}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(trace);
      return acc;
    }, {});
  }

  summarizeRecords() {
    const records = this.listRecords(200);
    return {
      total: records.length,
      bySeverity: records.reduce((acc, record) => {
        acc[record.severity] = (acc[record.severity] || 0) + 1;
        return acc;
      }, {}),
      latest: records.slice(0, 5)
    };
  }

  summarizeTraces() {
    const traces = this.listTraces(200);
    const byRoute = traces.reduce((acc, trace) => {
      const key = `${trace.method}:${trace.pathname}`;
      if (!acc[key]) {
        acc[key] = { count: 0, totalDuration: 0 };
      }
      acc[key].count += 1;
      acc[key].totalDuration += Number(trace.durationMs || 0);
      return acc;
    }, {});

    Object.values(byRoute).forEach(item => {
      item.averageDuration = item.count === 0 ? 0 : Math.round(item.totalDuration / item.count);
    });

    return {
      total: traces.length,
      byRoute,
      latest: traces.slice(0, 5)
    };
  }
}
