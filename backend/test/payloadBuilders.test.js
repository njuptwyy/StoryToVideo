import test from 'node:test';
import assert from 'node:assert/strict';
import { ProjectService } from '../src/services/projectService.js';
import { WorkflowService } from '../src/services/workflowService.js';
import { ReportService } from '../src/services/reportService.js';
import { AnalyticsService } from '../src/services/analyticsService.js';
import { ExportService } from '../src/services/exportService.js';
import { buildPayloadFactory } from '../src/serialization/index.js';

test('payload factory builds route friendly payloads', () => {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);
  const factory = buildPayloadFactory({ projectService, workflowService, reportService, analyticsService, exportService });
  const [project] = projectService.seed();

  const card = factory.projectCard(project.id);
  const summary = factory.summary();
  const pipeline = factory.pipeline();
  const manifest = factory.exportManifest(project.id);

  assert.equal(card.id, project.id);
  assert.ok(summary.totalProjects >= 4);
  assert.ok(Array.isArray(pipeline));
  assert.equal(manifest.projectId, project.id);
});
