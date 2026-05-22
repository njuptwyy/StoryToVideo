import test from 'node:test';
import assert from 'node:assert/strict';
import { createServices } from './helpers.js';

test('report service returns overview and snapshot data', () => {
  const { projectService, reportService } = createServices();
  projectService.seed();
  const overview = reportService.buildOverview();
  const snapshot = reportService.buildSnapshot();

  assert.ok(overview.stats.totalProjects >= 4);
  assert.ok(snapshot.statusMatrix);
  assert.ok(snapshot.priorityMatrix);
  assert.ok(snapshot.audit);
});

test('report service exports project bundle', () => {
  const { projectService, reportService } = createServices();
  const [project] = projectService.seed();
  const bundle = reportService.buildExportBundle(project.id);

  assert.equal(bundle.projectId, project.id);
  assert.ok(Array.isArray(bundle.items));
  assert.ok(bundle.items.length >= 2);
});
