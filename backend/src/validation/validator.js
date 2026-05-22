import { ValidationError } from '../core/errors.js';
import { getRule } from './rules.js';

function ensureStringValue(value, fieldName, rule) {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, { fieldName, value });
  }

  const trimmed = value.trim();
  if (trimmed.length < rule.minLength) {
    throw new ValidationError(`${fieldName} is too short`, { fieldName, value, minLength: rule.minLength });
  }

  if (trimmed.length > rule.maxLength) {
    throw new ValidationError(`${fieldName} is too long`, { fieldName, value, maxLength: rule.maxLength });
  }

  if (rule.pattern && !rule.pattern.test(trimmed)) {
    throw new ValidationError(`${fieldName} contains invalid characters`, { fieldName, value });
  }

  return trimmed;
}

function ensureEnumValue(value, fieldName, rule) {
  if (!rule.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${rule.join(', ')}`, { fieldName, value, allowed: rule });
  }
  return value;
}

export function validateProjectInput(input) {
  const titleRule = getRule('projectTitle');
  const priorityRule = getRule('priority');
  const statusRule = getRule('status');

  if (!input || typeof input !== 'object') {
    throw new ValidationError('project payload must be an object', { input });
  }

  return {
    ...input,
    title: ensureStringValue(input.title, 'title', titleRule),
    priority: input.priority ? ensureEnumValue(input.priority, 'priority', priorityRule) : 'medium',
    status: input.status ? ensureEnumValue(input.status, 'status', statusRule) : 'draft'
  };
}

export function validateStageKey(stageKey) {
  const rule = getRule('stageKey');
  return ensureEnumValue(stageKey, 'stageKey', rule);
}

export function validateSceneInput(input) {
  const rule = getRule('sceneTitle');
  if (!input || typeof input !== 'object') {
    throw new ValidationError('scene payload must be an object', { input });
  }

  return {
    ...input,
    title: ensureStringValue(input.title, 'scene title', rule)
  };
}

export function validateTaskInput(input) {
  const rule = getRule('taskName');
  if (!input || typeof input !== 'object') {
    throw new ValidationError('task payload must be an object', { input });
  }

  return {
    ...input,
    name: ensureStringValue(input.name, 'task name', rule)
  };
}

export function validateBatchProjectIds(input) {
  if (!Array.isArray(input)) {
    throw new ValidationError('projectIds must be an array', { input });
  }
  const cleaned = input.map(item => String(item).trim()).filter(Boolean);
  if (cleaned.length === 0) {
    throw new ValidationError('projectIds cannot be empty', { input });
  }
  return cleaned;
}

export function summarizeValidationRules() {
  return {
    projectTitle: getRule('projectTitle'),
    sceneTitle: getRule('sceneTitle'),
    taskName: getRule('taskName'),
    allowedPriorities: getRule('priority'),
    allowedStatuses: getRule('status'),
    allowedStages: getRule('stageKey')
  };
}
