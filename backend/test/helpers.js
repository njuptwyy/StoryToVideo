import { ProjectService } from '../src/services/projectService.js';
import { WorkflowService } from '../src/services/workflowService.js';
import { ReportService } from '../src/services/reportService.js';
import { AnalyticsService } from '../src/services/analyticsService.js';
import { ExportService } from '../src/services/exportService.js';

export function createServices() {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);

  return {
    projectService,
    workflowService,
    reportService,
    analyticsService,
    exportService
  };
}
