import test from 'node:test';
import assert from 'node:assert/strict';
import { createServices } from './helpers.js';

test('project service seeds and lists projects', () => {
  const { projectService } = createServices();
  const projects = projectService.seed();

  assert.ok(projects.length >= 4);
  assert.equal(typeof projects[0].id, 'string');
  assert.ok(Array.isArray(projects[0].checkpoints));
});

test('project service can create scenes and tasks', () => {
  const { projectService } = createServices();
  const [project] = projectService.seed();

  const updatedWithScene = projectService.addScene(project.id, {
    title: '测试场景',
    location: '图书馆',
    mood: 'quiet'
  });

  const updatedWithTask = projectService.addTask(project.id, {
    name: '测试任务',
    progress: 30
  });

  assert.equal(updatedWithScene.sceneCount, 1);
  assert.equal(updatedWithTask.taskCount, 1);
  assert.equal(updatedWithTask.progress, 30);
});

test('project service statistics reflect status counts', () => {
  const { projectService } = createServices();
  projectService.seed();
  const stats = projectService.statistics();

  assert.equal(stats.totalProjects >= 4, true);
  assert.ok(stats.generated >= 1);
  assert.ok(stats.averageProgress >= 0);
});
