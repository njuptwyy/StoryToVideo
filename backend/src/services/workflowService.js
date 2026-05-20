import { findStageByKey, getNextStage, getPreviousStage, buildStageNavigation, listCatalogNarrative } from '../domain/catalog.js';
import { ValidationError } from '../core/errors.js';
import { createId } from '../utils/id.js';

export class WorkflowService {
  constructor(projectService) {
    this.projectService = projectService;
  }

  getPipeline() {
    return buildStageNavigation();
  }

  getNarrative() {
    return listCatalogNarrative();
  }

  resolveStage(stageKey) {
    const stage = findStageByKey(stageKey);
    if (!stage) {
      return null;
    }
    const previous = getPreviousStage(stageKey);
    const next = getNextStage(stageKey);
    return {
      ...stage,
      previous: previous ? previous.key : null,
      next: next ? next.key : null
    };
  }

  ensureStage(stageKey) {
    const stage = this.resolveStage(stageKey);
    if (!stage) {
      throw new ValidationError(`Unknown stage: ${stageKey}`, { stageKey });
    }
    return stage;
  }

  advance(projectId, stageKey, payload = {}) {
    const stage = this.ensureStage(stageKey);
    const project = this.projectService.get(projectId);
    const history = Array.isArray(project.workflowHistory) ? project.workflowHistory : [];
    const entry = {
      id: createId('workflow'),
      stage: stage.key,
      label: stage.name,
      actor: payload.actor || 'system',
      message: payload.message || '',
      createdAt: new Date().toISOString()
    };

    const updated = this.projectService.update(projectId, {
      workflowStage: stage.key,
      workflowHistory: history.concat(entry),
      actor: payload.actor || project.owner || 'system'
    });

    return {
      project: updated,
      currentStage: stage,
      nextStage: stage.next ? this.resolveStage(stage.next) : null,
      previousStage: stage.previous ? this.resolveStage(stage.previous) : null,
      entry
    };
  }

  rewind(projectId, stageKey) {
    const stage = this.ensureStage(stageKey);
    const project = this.projectService.get(projectId);
    const history = Array.isArray(project.workflowHistory) ? project.workflowHistory : [];
    const filtered = history.filter(item => item.stage !== stage.key || item.rollback !== true);

    return this.projectService.update(projectId, {
      workflowStage: stage.key,
      workflowHistory: filtered.concat({
        id: createId('workflow'),
        stage: stage.key,
        label: `回退到 ${stage.name}`,
        rollback: true,
        createdAt: new Date().toISOString()
      })
    });
  }

  syncChecklist(projectId) {
    const project = this.projectService.get(projectId);
    const stage = this.resolveStage(project.workflowStage || 'intake') || this.resolveStage('intake');
    const checkpoints = stage.checkpoints.map((checkpoint, index) => ({
      id: createId('checklist'),
      order: index + 1,
      label: checkpoint,
      done: false
    }));

    return this.projectService.update(projectId, { workflowChecklist: checkpoints });
  }

  buildProgressReport(projectId) {
    const project = this.projectService.get(projectId);
    const pipeline = this.getPipeline();
    const stageIndex = pipeline.findIndex(step => step.key === (project.workflowStage || 'intake'));
    const history = Array.isArray(project.workflowHistory) ? project.workflowHistory : [];

    return {
      projectId,
      title: project.title,
      stageIndex,
      stageName: stageIndex >= 0 ? pipeline[stageIndex].name : '未知',
      pipeline,
      history,
      completionRate: pipeline.length === 0 ? 0 : Math.round(((stageIndex + 1) / pipeline.length) * 100),
      currentStage: this.resolveStage(project.workflowStage || 'intake')
    };
  }

  createStageTask(projectId, stageKey, description) {
    const stage = this.ensureStage(stageKey);
    const task = {
      id: createId('task'),
      name: `${stage.name}：${description}`,
      state: 'pending',
      progress: 0,
      stage: stage.key
    };
    this.projectService.addTask(projectId, task);
    return task;
  }

  batchCreateTasks(projectId, stageKey, descriptions) {
    if (!Array.isArray(descriptions) || descriptions.length === 0) {
      return [];
    }
    return descriptions.map(description => this.createStageTask(projectId, stageKey, description));
  }

  annotateScene(projectId, sceneId, annotation) {
    const project = this.projectService.get(projectId);
    const scenes = Array.isArray(project.scenes) ? project.scenes : [];
    const nextScenes = scenes.map(scene => {
      if (scene.id !== sceneId) {
        return scene;
      }
      const notes = Array.isArray(scene.notes) ? scene.notes : [];
      return {
        ...scene,
        notes: notes.concat({
          id: createId('note'),
          body: annotation,
          createdAt: new Date().toISOString()
        })
      };
    });
    return this.projectService.update(projectId, { scenes: nextScenes });
  }

  describeStage(stageKey) {
    const stage = this.ensureStage(stageKey);
    return {
      key: stage.key,
      name: stage.name,
      icon: stage.icon,
      summary: stage.summary,
      checkpoints: [...stage.checkpoints],
      outputs: [...stage.outputs]
    };
  }
}
