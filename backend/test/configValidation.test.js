import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, describeConfig } from '../src/config/loader.js';
import {
  validateProjectInput,
  validateSceneInput,
  validateTaskInput,
  validateStageKey,
  validateBatchProjectIds,
  summarizeValidationRules
} from '../src/validation/index.js';

test('config loader produces runtime config', () => {
  const config = loadConfig({ NODE_ENV: 'test', PORT: '4000', HOST: '127.0.0.1' });
  const described = describeConfig(config);

  assert.equal(config.port, 4000);
  assert.equal(config.profile, 'test');
  assert.equal(described.host, '127.0.0.1');
  assert.ok(Array.isArray(described.features));
});

test('validation accepts project, scene, and task payloads', () => {
  const project = validateProjectInput({ title: '测试项目', priority: 'high', status: 'draft' });
  const scene = validateSceneInput({ title: '第一场景' });
  const task = validateTaskInput({ name: '镜头整理' });

  assert.equal(project.priority, 'high');
  assert.equal(scene.title, '第一场景');
  assert.equal(task.name, '镜头整理');
});

test('validation exposes allowed stage and batch rules', () => {
  const stageKey = validateStageKey('storyboard');
  const ids = validateBatchProjectIds(['a', 'b', 'c']);
  const rules = summarizeValidationRules();

  assert.equal(stageKey, 'storyboard');
  assert.equal(ids.length, 3);
  assert.ok(rules.allowedStatuses.includes('generated'));
});
