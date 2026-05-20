import { MemoryStore } from './memoryStore.js';
import { createId } from '../utils/id.js';
import { nowIso } from '../utils/time.js';
import { sampleProjectBlueprints } from '../domain/catalog.js';

const defaultSeed = {
  projects: sampleProjectBlueprints.map((blueprint, index) => ({
    id: createId(`project-${index + 1}`),
    title: blueprint.name,
    theme: blueprint.theme,
    scene: blueprint.scene,
    owner: 'system',
    status: index % 3 === 0 ? 'draft' : index % 3 === 1 ? 'reviewing' : 'generated',
    priority: blueprint.priority,
    shotCount: blueprint.shots,
    createdAt: nowIso(),
    updatedAt: nowIso()
  })),
  scenes: [],
  tasks: [],
  auditLogs: []
};

export class ProjectRepository {
  constructor(store = new MemoryStore(defaultSeed)) {
    this.store = store;
  }

  listProjects(filter = {}) {
    const { status, priority, keyword } = filter;
    return this.store.list('projects', project => {
      const statusMatch = !status || project.status === status;
      const priorityMatch = !priority || project.priority === priority;
      const keywordMatch = !keyword || [project.title, project.scene, project.owner]
        .join(' ')
        .toLowerCase()
        .includes(String(keyword).toLowerCase());
      return statusMatch && priorityMatch && keywordMatch;
    });
  }

  getProject(id) {
    return this.store.findById('projects', id);
  }

  createProject(payload) {
    return this.store.insert('projects', {
      title: payload.title,
      theme: Array.isArray(payload.theme) ? payload.theme : [],
      scene: payload.scene || '未命名场景',
      owner: payload.owner || 'anonymous',
      status: payload.status || 'draft',
      priority: payload.priority || 'medium',
      shotCount: Number(payload.shotCount || 0),
      description: payload.description || '',
      tags: Array.isArray(payload.tags) ? payload.tags : []
    });
  }

  updateProject(id, patch) {
    return this.store.update('projects', id, patch);
  }

  deleteProject(id) {
    return this.store.remove('projects', id);
  }

  upsertProject(project) {
    return this.store.upsert('projects', project);
  }

  markStatus(id, status) {
    return this.store.update('projects', id, { status });
  }

  attachScene(projectId, scene) {
    const project = this.getProject(projectId);
    if (!project) {
      return null;
    }

    const scenes = Array.isArray(project.scenes) ? project.scenes : [];
    const nextScenes = scenes.concat({
      id: scene.id || createId('scene'),
      title: scene.title,
      mood: scene.mood || 'normal',
      location: scene.location || 'unknown',
      note: scene.note || '',
      order: Number(scene.order || scenes.length + 1)
    });

    return this.updateProject(projectId, { scenes: nextScenes });
  }

  appendTask(projectId, task) {
    const project = this.getProject(projectId);
    if (!project) {
      return null;
    }

    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const nextTasks = tasks.concat({
      id: task.id || createId('task'),
      name: task.name,
      state: task.state || 'pending',
      assignee: task.assignee || 'system',
      progress: Number(task.progress || 0),
      dueAt: task.dueAt || null
    });

    return this.updateProject(projectId, { tasks: nextTasks });
  }

  updateTask(projectId, taskId, patch) {
    const project = this.getProject(projectId);
    if (!project) {
      return null;
    }

    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const index = tasks.findIndex(task => task.id === taskId);
    if (index < 0) {
      return null;
    }

    const nextTasks = [...tasks];
    nextTasks[index] = {
      ...nextTasks[index],
      ...patch,
      id: nextTasks[index].id
    };

    return this.updateProject(projectId, { tasks: nextTasks });
  }

  listScenes(projectId) {
    const project = this.getProject(projectId);
    return Array.isArray(project?.scenes) ? project.scenes : [];
  }

  listTasks(projectId) {
    const project = this.getProject(projectId);
    return Array.isArray(project?.tasks) ? project.tasks : [];
  }

  addAuditLog(entry) {
    return this.store.insert('auditLogs', entry);
  }

  listAuditLogs(limit = 50) {
    return this.store.list('auditLogs').slice(-limit).reverse();
  }

  replaceAllProjects(projects) {
    return this.store.replace('projects', projects);
  }

  seedIfEmpty() {
    if (this.store.count('projects') > 0) {
      return this.listProjects();
    }
    this.replaceAllProjects(defaultSeed.projects);
    return this.listProjects();
  }

  rebuildIndexes() {
    const projects = this.listProjects();
    const byStatus = projects.reduce((acc, project) => {
      if (!acc[project.status]) {
        acc[project.status] = 0;
      }
      acc[project.status] += 1;
      return acc;
    }, {});

    const byPriority = projects.reduce((acc, project) => {
      if (!acc[project.priority]) {
        acc[project.priority] = 0;
      }
      acc[project.priority] += 1;
      return acc;
    }, {});

    return {
      total: projects.length,
      byStatus,
      byPriority
    };
  }
}
