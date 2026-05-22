import { createSlug, stableHash } from '../utils/id.js';
import { formatDateTime } from '../utils/time.js';

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags.map(tag => String(tag).trim()).filter(Boolean);
}

export function serializeProjectCard(project) {
  return {
    id: project.id,
    slug: createSlug(project.title),
    title: project.title,
    status: project.status,
    priority: project.priority,
    progress: Number(project.progress || 0),
    sceneCount: Number(project.sceneCount || 0),
    taskCount: Number(project.taskCount || 0),
    updatedAt: project.updatedAt || null,
    updatedAtText: formatDateTime(project.updatedAt),
    digest: stableHash(`${project.id}|${project.title}|${project.status}`),
    tags: normalizeTags(project.tags)
  };
}

export function serializeProjectDetail(project, timeline = {}) {
  const scenes = Array.isArray(project.scenes) ? project.scenes : [];
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];

  return {
    meta: serializeProjectCard(project),
    scenes: scenes.map((scene, index) => ({
      order: index + 1,
      id: scene.id,
      title: scene.title,
      location: scene.location,
      mood: scene.mood,
      note: scene.note || '',
      notes: Array.isArray(scene.notes) ? scene.notes : []
    })),
    tasks: tasks.map((task, index) => ({
      order: index + 1,
      id: task.id,
      name: task.name,
      state: task.state,
      progress: Number(task.progress || 0),
      assignee: task.assignee || 'system'
    })),
    timeline,
    history: Array.isArray(project.workflowHistory) ? project.workflowHistory : [],
    checklist: Array.isArray(project.workflowChecklist) ? project.workflowChecklist : []
  };
}

export function serializeProjectList(projects) {
  return projects.map(project => serializeProjectCard(project));
}

export function serializeStage(stage, pipeline = []) {
  return {
    ...stage,
    pipelineSize: pipeline.length,
    isTerminal: pipeline.at(-1)?.key === stage.key,
    previousKey: stage.previous || null,
    nextKey: stage.next || null
  };
}

export function serializeSummary(summary) {
  return {
    generatedAt: new Date().toISOString(),
    totalProjects: summary.totalProjects || 0,
    totalScenes: summary.totalScenes || 0,
    totalTasks: summary.totalTasks || 0,
    averageProgress: summary.averageProgress || 0,
    completedProjects: summary.generated || 0,
    draftProjects: summary.draft || 0,
    reviewingProjects: summary.reviewing || 0
  };
}
