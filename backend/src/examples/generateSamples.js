import { ProjectService } from '../services/projectService.js';
import { WorkflowService } from '../services/workflowService.js';
import { ReportService } from '../services/reportService.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { ExportService } from '../services/exportService.js';

export function buildSamplePayloads() {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);

  const [project] = projectService.seed();

  return {
    overview: analyticsService.computeOverview(),
    pipeline: workflowService.getPipeline(),
    projectCard: reportService.buildProjectCard(project.id),
    projectDetail: reportService.buildProjectDetail(project.id),
    exportManifest: exportService.buildManifest(project.id),
    exportPackage: exportService.buildProjectPackage(project.id)
  };
}

export function createSampleCollection() {
  const payloads = buildSamplePayloads();
  return {
    generatedAt: new Date().toISOString(),
    files: [
      { name: 'overview.json', value: payloads.overview },
      { name: 'pipeline.json', value: payloads.pipeline },
      { name: 'project-card.json', value: payloads.projectCard },
      { name: 'project-detail.json', value: payloads.projectDetail },
      { name: 'export-manifest.json', value: payloads.exportManifest },
      { name: 'export-package.json', value: payloads.exportPackage }
    ]
  };
}
