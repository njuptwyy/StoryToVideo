import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeProjectCard, serializeProjectDetail, serializeSummary } from '../src/serialization/index.js';

test('serializeProjectCard produces stable dto fields', () => {
  const card = serializeProjectCard({
    id: 'p1',
    title: '样例项目',
    status: 'draft',
    priority: 'high',
    progress: 45,
    sceneCount: 3,
    taskCount: 2,
    updatedAt: '2026-01-01T00:00:00.000Z',
    tags: ['A', 'B']
  });

  assert.equal(card.id, 'p1');
  assert.equal(card.priority, 'high');
  assert.equal(card.tags.length, 2);
  assert.ok(card.digest);
});

test('serializeProjectDetail packages nested collections', () => {
  const detail = serializeProjectDetail({
    id: 'p1',
    title: '样例项目',
    status: 'generated',
    priority: 'medium',
    scenes: [{ id: 's1', title: '场景1', location: '图书馆', mood: 'calm' }],
    tasks: [{ id: 't1', name: '任务1', state: 'done', progress: 100 }],
    workflowHistory: [{ id: 'h1', stage: 'storyboard' }],
    workflowChecklist: [{ id: 'c1', label: '检查1' }]
  }, { sceneCount: 1 });

  assert.equal(detail.scenes.length, 1);
  assert.equal(detail.tasks.length, 1);
  assert.equal(detail.checklist.length, 1);
});

test('serializeSummary builds report friendly shape', () => {
  const summary = serializeSummary({ totalProjects: 4, totalScenes: 7, totalTasks: 9, averageProgress: 66, generated: 2, draft: 1, reviewing: 1 });

  assert.equal(summary.totalProjects, 4);
  assert.equal(summary.completedProjects, 2);
  assert.equal(summary.reviewingProjects, 1);
});
