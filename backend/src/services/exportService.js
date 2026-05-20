import { createId, createSlug } from '../utils/id.js';
import { formatDateTime } from '../utils/time.js';

export class ExportService {
  constructor(projectService, analyticsService, reportService) {
    this.projectService = projectService;
    this.analyticsService = analyticsService;
    this.reportService = reportService;
  }

  buildProjectPackage(projectId) {
    const project = this.projectService.get(projectId);
    const report = this.reportService.buildProjectDetail(projectId);
    const analytics = this.analyticsService.buildInsights();

    return {
      packageId: createId('package'),
      projectId: project.id,
      slug: createSlug(project.title),
      title: project.title,
      exportedAt: new Date().toISOString(),
      exportedAtText: formatDateTime(new Date()),
      content: {
        project,
        report,
        analytics: {
          overview: analytics.overview,
          rankings: analytics.rankings.slice(0, 10)
        }
      }
    };
  }

  buildManifest(projectId) {
    const project = this.projectService.get(projectId);
    const scenes = this.projectService.repository.listScenes(projectId);
    const tasks = this.projectService.repository.listTasks(projectId);

    return {
      manifestId: createId('manifest'),
      projectId: project.id,
      name: project.title,
      counts: {
        scenes: scenes.length,
        tasks: tasks.length,
        checkpoints: Array.isArray(project.checkpoints) ? project.checkpoints.length : 0
      },
      entries: [
        { type: 'meta', label: '项目元数据', size: Object.keys(project).length },
        { type: 'scenes', label: '场景列表', size: scenes.length },
        { type: 'tasks', label: '任务列表', size: tasks.length },
        { type: 'report', label: '项目报告', size: Object.keys(this.reportService.buildProjectDetail(projectId)).length }
      ]
    };
  }

  buildBatchExport(projectIds = []) {
    return {
      batchId: createId('batch'),
      total: projectIds.length,
      packages: projectIds.map(projectId => this.buildProjectPackage(projectId))
    };
  }

  buildArchiveIndex() {
    const projects = this.projectService.list();
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      status: project.status,
      priority: project.priority,
      exported: Boolean(project.exportedAt),
      latestPackage: this.buildProjectPackage(project.id).packageId
    }));
  }

  buildSnapshotBundle() {
    const packageEntries = this.projectService.list().slice(0, 5).map(project => this.buildProjectPackage(project.id));
    return {
      snapshotId: createId('snapshot'),
      generatedAt: new Date().toISOString(),
      packages: packageEntries,
      manifest: packageEntries.map(item => ({ id: item.packageId, title: item.title }))
    };
  }
}
