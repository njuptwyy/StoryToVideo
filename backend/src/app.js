import { AppError, errorToJSON, normalizeError } from './core/errors.js';
import { ProjectService } from './services/projectService.js';
import { WorkflowService } from './services/workflowService.js';
import { ReportService } from './services/reportService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { ExportService } from './services/exportService.js';
import { sendJson, createRouter } from './router.js';
import { createRuntimeConfig, describeConfig } from './config/loader.js';
import {
  validateProjectInput,
  validateSceneInput,
  validateTaskInput,
  validateStageKey,
  validateBatchProjectIds,
  summarizeValidationRules
} from './validation/index.js';
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
  const runtimeConfig = createRuntimeConfig();

  const router = createRouter();

  async function requestToJson(request) {
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }
    if (chunks.length === 0) {
      return {};
    }
    const payload = Buffer.concat(chunks).toString('utf8').trim();
    return payload ? JSON.parse(payload) : {};
  }

  router.get('/health', async () => ({
    ok: true,
    service: 'story-to-video-backend',
    timestamp: new Date().toISOString(),
    config: describeConfig(runtimeConfig),
    report: reportService.buildHealthCheck()
  }));

  registerProjectRoutes(router, projectService, reportService);
  registerWorkflowRoutes(router, workflowService);
  registerReportRoutes(router, reportService);
  registerAnalyticsRoutes(router, analyticsService);
  registerExportRoutes(router, exportService);

  router.get('/config', async () => describeConfig(runtimeConfig));
  router.get('/validation/rules', async () => summarizeValidationRules());

  registerProjectRoutes(router, projectService, reportService);
  registerWorkflowRoutes(router, workflowService);
  registerReportRoutes(router, reportService);
  registerAnalyticsRoutes(router, analyticsService);
  registerExportRoutes(router, exportService);

  router.post('/debug/project-preview', async request => {
    const body = await requestToJson(request);
    return validateProjectInput(body);
  });
  router.post('/debug/scene-preview', async request => {
    const body = await requestToJson(request);
    return validateSceneInput(body);
  });
  router.post('/debug/task-preview', async request => {
    const body = await requestToJson(request);
    return validateTaskInput(body);
  });
  router.post('/debug/stage-preview', async request => {
    const body = await requestToJson(request);
    return { stageKey: validateStageKey(body.stageKey) };
  });
  router.post('/debug/batch-preview', async request => {
    const body = await requestToJson(request);
    return { projectIds: validateBatchProjectIds(body.projectIds) };
  });

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
