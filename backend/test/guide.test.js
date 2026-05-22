import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSerializationGuide, buildRouteManifest, buildFieldMatrix } from '../src/serialization/guide.js';

test('serialization guide lists the key sections', () => {
  const guide = buildSerializationGuide();
  assert.equal(guide.sections.length, 4);
  assert.equal(guide.sections[0].name, 'project-card');
});

test('route manifest lists serialization endpoints', () => {
  const manifest = buildRouteManifest();
  assert.ok(manifest.includes('GET /serialize/summary'));
  assert.ok(manifest.includes('GET /serialize/export/:projectId/manifest'));
});

test('field matrix derives project card metadata', () => {
  const matrix = buildFieldMatrix({
    id: 'p1',
    title: 'Demo',
    status: 'draft',
    priority: 'high',
    progress: 10,
    sceneCount: 1,
    taskCount: 2,
    updatedAt: '2026-01-01T00:00:00.000Z',
    tags: ['x']
  });

  assert.ok(matrix.some(item => item.key === 'title'));
});
