import test from 'node:test';
import assert from 'node:assert/strict';
import { createServices } from './helpers.js';

test('analytics service builds overview and insights', () => {
  const { projectService, analyticsService } = createServices();
  projectService.seed();
  const overview = analyticsService.computeOverview();
  const insights = analyticsService.buildInsights();

  assert.ok(overview.totalProjects >= 4);
  assert.ok(Array.isArray(insights.rankings));
  assert.ok(insights.heatmap);
});

test('export service builds project packages and manifests', () => {
  const { projectService, exportService } = createServices();
  const [project] = projectService.seed();
  const pkg = exportService.buildProjectPackage(project.id);
  const manifest = exportService.buildManifest(project.id);

  assert.equal(pkg.projectId, project.id);
  assert.equal(manifest.projectId, project.id);
  assert.ok(Array.isArray(manifest.entries));
});
