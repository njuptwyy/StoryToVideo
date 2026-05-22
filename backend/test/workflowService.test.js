import test from 'node:test';
import assert from 'node:assert/strict';
import { createServices } from './helpers.js';

test('workflow service exposes a pipeline and stage detail', () => {
  const { workflowService } = createServices();
  const pipeline = workflowService.getPipeline();
  const stage = workflowService.describeStage('storyboard');

  assert.ok(Array.isArray(pipeline));
  assert.ok(pipeline.length >= 4);
  assert.equal(stage.key, 'storyboard');
  assert.ok(Array.isArray(stage.checkpoints));
});

test('workflow service can advance a project stage', () => {
  const { projectService, workflowService } = createServices();
  const [project] = projectService.seed();
  const result = workflowService.advance(project.id, 'structure', {
    actor: 'tester',
    message: 'advance to structure'
  });

  assert.equal(result.project.workflowStage, 'structure');
  assert.equal(result.currentStage.key, 'structure');
  assert.ok(Array.isArray(result.project.workflowHistory));
});

test('workflow service creates checklist entries', () => {
  const { projectService, workflowService } = createServices();
  const [project] = projectService.seed();
  const updated = workflowService.syncChecklist(project.id);

  assert.ok(Array.isArray(updated.workflowChecklist));
  assert.ok(updated.workflowChecklist.length > 0);
});
