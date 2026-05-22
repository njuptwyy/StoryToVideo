import { AppError, errorToJSON, normalizeError } from './core/errors.js';
import { ProjectService } from './services/projectService.js';
import { WorkflowService } from './services/workflowService.js';
import { ReportService } from './services/reportService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { ExportService } from './services/exportService.js';
import { sendJson, createRouter } from './router.js';
import {
  registerProjectRoutes,
  registerWorkflowRoutes,
  registerReportRoutes,
  registerAnalyticsRoutes,
  registerExportRoutes
} from './controllers/index.js';

export function createApp() {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);

  const router = createRouter();

  router.get('/health', async () => ({
    ok: true,
    service: 'story-to-video-backend',
    timestamp: new Date().toISOString(),
    report: reportService.buildHealthCheck()
  }));

  registerProjectRoutes(router, projectService, reportService);
  registerWorkflowRoutes(router, workflowService);
  registerReportRoutes(router, reportService);
  registerAnalyticsRoutes(router, analyticsService);
  registerExportRoutes(router, exportService);

  router.use(async context => {
    throw new AppError('NOT_FOUND', `Route ${context.method} ${context.pathname} not found`, {
      pathname: context.pathname,
      method: context.method
    }, 404);
  });

  async function handle(request, response) {
    try {
      const result = await router.dispatch(request);
      await sendJson(response, 200, result);
    } catch (error) {
      const normalized = normalizeError(error);
      await sendJson(response, normalized.status || 500, errorToJSON(normalized));
    }
  }

  return {
    handle,
    projectService,
    workflowService,
    reportService,
    analyticsService,
    exportService,
    router
  };
}
