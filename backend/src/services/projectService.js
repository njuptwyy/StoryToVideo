import { ProjectRepository } from '../repositories/projectRepository.js';
import { createId, createSequenceId } from '../utils/id.js';
import { ValidationError, NotFoundError } from '../core/errors.js';
import { summarizeCatalog, buildStageNavigation } from '../domain/catalog.js';

export class ProjectService {
  constructor(repository = new ProjectRepository()) {
    this.repository = repository;
  }

  list(filter = {}) {
    const items = this.repository.listProjects(filter);
    return items.map(item => this.enrich(item));
  }

  get(projectId) {
    const project = this.repository.getProject(projectId);
    if (!project) {
      throw new NotFoundError('Project', { projectId });
    }
    return this.enrich(project);
  }

  create(input) {
    if (!input?.title) {
      throw new ValidationError('title is required', { input });
    }

    const project = this.repository.createProject({
      ...input,
      title: String(input.title).trim(),
      status: input.status || 'draft',
      shotCount: Number(input.shotCount || 0)
    });

    this.repository.addAuditLog({
      projectId: project.id,
      action: 'create',
      actor: input.owner || 'system',
      metadata: { title: project.title }
    });

    return this.enrich(project);
  }

  update(projectId, patch) {
    const next = this.repository.updateProject(projectId, patch);
    if (!next) {
      throw new NotFoundError('Project', { projectId });
    }
    this.repository.addAuditLog({
      projectId,
      action: 'update',
      actor: patch.actor || 'system',
      metadata: { keys: Object.keys(patch || {}) }
    });
    return this.enrich(next);
  }

  remove(projectId) {
    const removed = this.repository.deleteProject(projectId);
    if (!removed) {
      throw new NotFoundError('Project', { projectId });
    }
    this.repository.addAuditLog({
      projectId,
      action: 'remove',
      actor: 'system',
      metadata: { title: removed.title }
    });
    return removed;
  }

  markStatus(projectId, status) {
    return this.update(projectId, { status });
  }

  addScene(projectId, scene) {
    const updated = this.repository.attachScene(projectId, scene);
    if (!updated) {
      throw new NotFoundError('Project', { projectId });
    }
    return this.enrich(updated);
  }

  addTask(projectId, task) {
    const updated = this.repository.appendTask(projectId, {
      ...task,
      id: task.id || createId('task')
    });
    if (!updated) {
      throw new NotFoundError('Project', { projectId });
    }
    return this.enrich(updated);
  }

  patchTask(projectId, taskId, patch) {
    const updated = this.repository.updateTask(projectId, taskId, patch);
    if (!updated) {
      throw new NotFoundError('Task', { projectId, taskId });
    }
    return this.enrich(updated);
  }

  seed() {
    const projects = this.repository.seedIfEmpty();
    return projects.map(item => this.enrich(item));
  }

  dashboard() {
    const projects = this.list();
    const summary = summarizeCatalog();
    const total = projects.length;
    const statusMap = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    const priorityMap = projects.reduce((acc, project) => {
      acc[project.priority] = (acc[project.priority] || 0) + 1;
      return acc;
    }, {});

    const activeProjects = projects.filter(project => project.status !== 'archived');
    const recent = [...projects]
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
      .slice(0, 5);

    return {
      total,
      activeCount: activeProjects.length,
      statusMap,
      priorityMap,
      stageCount: summary.stageCount,
      familyCount: summary.familyCount,
      recent,
      steps: buildStageNavigation()
    };
  }

  timeline(projectId) {
    const project = this.get(projectId);
    const scenes = this.repository.listScenes(projectId);
    const tasks = this.repository.listTasks(projectId);

    return {
      projectId,
      title: project.title,
      sceneCount: scenes.length,
      taskCount: tasks.length,
      sceneTimeline: scenes.map((scene, index) => ({
        order: index + 1,
        id: scene.id || createSequenceId('scene', index),
        title: scene.title,
        location: scene.location,
        mood: scene.mood
      })),
      taskTimeline: tasks.map((task, index) => ({
        order: index + 1,
        id: task.id || createSequenceId('task', index),
        name: task.name,
        state: task.state,
        progress: task.progress
      }))
    };
  }

  enrich(project) {
    const scenes = Array.isArray(project.scenes) ? project.scenes : [];
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const progress = tasks.length === 0
      ? 0
      : Math.round(tasks.reduce((sum, task) => sum + Number(task.progress || 0), 0) / tasks.length);

    return {
      ...project,
      scenes,
      tasks,
      progress,
      sceneCount: scenes.length,
      taskCount: tasks.length,
      checkpoints: this.buildCheckpoints(project)
    };
  }

  buildCheckpoints(project) {
    return [
      {
        id: createId('checkpoint'),
        label: '创建时间',
        value: project.createdAt || ''
      },
      {
        id: createId('checkpoint'),
        label: '最近更新',
        value: project.updatedAt || ''
      },
      {
        id: createId('checkpoint'),
        label: '分镜数量',
        value: String(Array.isArray(project.scenes) ? project.scenes.length : 0)
      },
      {
        id: createId('checkpoint'),
        label: '任务数量',
        value: String(Array.isArray(project.tasks) ? project.tasks.length : 0)
      }
    ];
  }

  statistics() {
    const projects = this.list();
    const stats = projects.reduce((acc, project) => {
      acc.totalProjects += 1;
      acc.totalScenes += project.sceneCount;
      acc.totalTasks += project.taskCount;
      acc.progressSum += project.progress;
      if (project.status === 'generated') {
        acc.generated += 1;
      }
      if (project.status === 'draft') {
        acc.draft += 1;
      }
      if (project.status === 'reviewing') {
        acc.reviewing += 1;
      }
      return acc;
    }, {
      totalProjects: 0,
      totalScenes: 0,
      totalTasks: 0,
      progressSum: 0,
      generated: 0,
      draft: 0,
      reviewing: 0
    });

    stats.averageProgress = stats.totalProjects === 0 ? 0 : Math.round(stats.progressSum / stats.totalProjects);
    return stats;
  }
}
