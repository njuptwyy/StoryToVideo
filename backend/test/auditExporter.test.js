import test from 'node:test';
import assert from 'node:assert/strict';
import { AuditService } from '../src/services/auditService.js';
import { AuditExporter } from '../src/services/auditExporter.js';

test('audit exporter builds markdown report', () => {
  const auditService = new AuditService();
  auditService.recordAction('project.create', { entity: 'project', entityId: 'p1', message: 'created' });
  auditService.traceRequest({ method: 'GET', pathname: '/health', status: 200, durationMs: 5 });

  const exporter = new AuditExporter(auditService);
  const report = exporter.buildMarkdownReport();

  assert.match(report, /# Audit Report/);
  assert.match(report, /Latest Records/);
  assert.match(report, /Latest Traces/);
});
