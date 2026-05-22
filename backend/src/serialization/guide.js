import { serializeProjectCard } from './serializers.js';

export function buildSerializationGuide() {
  return {
    sections: [
      {
        name: 'project-card',
        description: 'Compact DTO for listing and dashboards'
      },
      {
        name: 'project-detail',
        description: 'Nested DTO for scenes, tasks, history, and checklist'
      },
      {
        name: 'pipeline',
        description: 'Workflow stage list with traversal metadata'
      },
      {
        name: 'summary',
        description: 'Aggregate counts used in screenshots and reports'
      }
    ]
  };
}

export function buildRouteManifest() {
  return [
    'GET /serialize/projects',
    'GET /serialize/projects/:id/card',
    'GET /serialize/projects/:id/detail',
    'GET /serialize/workflow/:stageKey',
    'GET /serialize/pipeline',
    'GET /serialize/summary',
    'GET /serialize/overview',
    'GET /serialize/snapshot',
    'GET /serialize/export/:projectId/package',
    'GET /serialize/export/:projectId/manifest'
  ];
}

export function buildFieldMatrix(project) {
  const card = serializeProjectCard(project);
  return Object.entries(card).map(([key, value]) => ({
    key,
    type: Array.isArray(value) ? 'array' : typeof value,
    preview: Array.isArray(value) ? value.slice(0, 3) : value
  }));
}
