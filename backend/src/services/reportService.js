import { formatDateTime, buildTimelineWindow, describeWindow } from '../utils/time.js';
import { createId } from '../utils/id.js';

export class ReportService {
  constructor(projectService) {
    this.projectService = projectService;
  }

  buildOverview() {
    const stats = this.projectService.statistics();
    const dashboard = this.projectService.dashboard();
    return {
      generatedAt: formatDateTime(new Date()),
      summaryWindow: describeWindow(buildTimelineWindow(7)),
      stats,
      dashboard
    };
  }

  buildProjectCard(projectId) {
    const project = this.projectService.get(projectId);
    return {
      id: project.id,
      title: project.title,
      owner: project.owner,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      sceneCount: project.sceneCount,
      taskCount: project.taskCount,
      updatedAt: project.updatedAt,
      checkpoints: project.checkpoints
    };
  }

  buildProjectDetail(projectId) {
    const project = this.projectService.get(projectId);
    const timeline = this.projectService.timeline(projectId);
    return {
      meta: this.buildProjectCard(projectId),
      scenes: project.scenes,
      tasks: project.tasks,
      timeline,
      history: project.workflowHistory || [],
      checklist: project.workflowChecklist || []
    };
  }

  buildStatusMatrix() {
    const projects = this.projectService.list();
    const matrix = {};

    projects.forEach(project => {
      if (!matrix[project.status]) {
        matrix[project.status] = [];
      }
      matrix[project.status].push({
        id: project.id,
        title: project.title,
        priority: project.priority,
        progress: project.progress
      });
    });

    return matrix;
  }

  buildPriorityMatrix() {
    const projects = this.projectService.list();
    return projects.reduce((acc, project) => {
      if (!acc[project.priority]) {
        acc[project.priority] = [];
      }
      acc[project.priority].push(project.id);
      return acc;
    }, {});
  }

  buildAuditSummary() {
    const logs = this.projectService.repository.listAuditLogs(200);
    const grouped = logs.reduce((acc, entry) => {
      if (!acc[entry.action]) {
        acc[entry.action] = 0;
      }
      acc[entry.action] += 1;
      return acc;
    }, {});

    return {
      total: logs.length,
      grouped,
      latest: logs.slice(0, 10)
    };
  }

  buildExportBundle(projectId) {
    const project = this.projectService.get(projectId);
    return {
      bundleId: createId('bundle'),
      projectId: project.id,
      name: project.title,
      generatedAt: new Date().toISOString(),
      items: [
        {
          type: 'project-card',
          payload: this.buildProjectCard(projectId)
        },
        {
          type: 'project-detail',
          payload: this.buildProjectDetail(projectId)
        }
      ]
    };
  }

  buildSnapshot() {
    const overview = this.buildOverview();
    const statusMatrix = this.buildStatusMatrix();
    const priorityMatrix = this.buildPriorityMatrix();
    const audit = this.buildAuditSummary();

    return {
      overview,
      statusMatrix,
      priorityMatrix,
      audit,
      generatedAt: new Date().toISOString()
    };
  }

  buildDailyBrief() {
    const projects = this.projectService.list();
    const topProjects = [...projects]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    return {
      title: 'Daily Brief',
      generatedAt: formatDateTime(new Date()),
      focusProjects: topProjects.map(project => ({
        id: project.id,
        title: project.title,
        progress: project.progress,
        status: project.status
      })),
      totalProjects: projects.length
    };
  }

  buildHealthCheck() {
    const overview = this.buildOverview();
    const stats = overview.stats;
    const healthy = stats.totalProjects >= 0 && stats.totalScenes >= 0 && stats.totalTasks >= 0;

    return {
      healthy,
      checks: [
        { name: 'project-count', passed: stats.totalProjects >= 0 },
        { name: 'scene-count', passed: stats.totalScenes >= 0 },
        { name: 'task-count', passed: stats.totalTasks >= 0 }
      ]
    };
  }
}
