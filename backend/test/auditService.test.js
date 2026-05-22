import test from 'node:test';
import assert from 'node:assert/strict';
import { AuditService } from '../src/services/auditService.js';
import { Logger } from '../src/core/logger.js';

test('audit service records actions and traces', () => {
  const auditService = new AuditService();

  const record = auditService.recordAction('project.create', {
    entity: 'project',
    entityId: 'p-1',
    severity: 'info',
    message: 'create project'
  });

  const trace = auditService.traceRequest({
    method: 'GET',
    pathname: '/health',
    status: 200,
    durationMs: 18
  });

  assert.equal(record.action, 'project.create');
  assert.equal(trace.pathname, '/health');
  assert.equal(auditService.getAuditSummary().records.total >= 1, true);
});

test('logger keeps records and summaries', () => {
  const logger = new Logger('debug', { log() {} });
  logger.info('info message');
  logger.warn('warn message');
  logger.error('error message');

  const summary = logger.summary();
  assert.equal(summary.total, 3);
  assert.equal(summary.counts.info, 1);
  assert.equal(summary.counts.warn, 1);
  assert.equal(summary.counts.error, 1);
});
