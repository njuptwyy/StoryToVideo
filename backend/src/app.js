import { AppError, errorToJSON, normalizeError } from './core/errors.js';
import { ProjectService } from './services/projectService.js';
import { WorkflowService } from './services/workflowService.js';
import { ReportService } from './services/reportService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { ExportService } from './services/exportService.js';
import { AuditService } from './services/auditService.js';
import { RequestTraceService } from './services/requestTraceService.js';
import { AuditExporter } from './services/auditExporter.js';
import { sendJson, createRouter, parseJsonBody } from './router.js';
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
import { buildRequestContext, describeRequestContext } from './core/requestContext.js';
import { buildPayloadFactory, buildSerializationGuide, buildRouteManifest, buildFieldMatrix } from './serialization/index.js';

export function createApp() {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);
  const auditService = new AuditService();
  const requestTraceService = new RequestTraceService(auditService);
  const auditExporter = new AuditExporter(auditService);
  const payloadFactory = buildPayloadFactory({ projectService, workflowService, reportService, analyticsService, exportService });
  const runtimeConfig = createRuntimeConfig();

  const router = createRouter();

  router.get('/health', async () => ({
    ok: true,
    service: 'story-to-video-backend',
    timestamp: new Date().toISOString(),
    config: describeConfig(runtimeConfig),
    audit: auditService.getLogSummary(),
    report: reportService.buildHealthCheck()
  }));

  router.get('/config', async () => describeConfig(runtimeConfig));
  router.get('/validation/rules', async () => summarizeValidationRules());

  router.get('/audit/summary', async () => auditService.getAuditSummary());
  router.get('/audit/records', async () => auditService.listLatestRecords());
  router.get('/audit/traces', async () => auditService.listLatestTraces());
  router.get('/audit/dashboard', async () => auditService.buildDashboard());
  router.get('/audit/markdown', async () => auditExporter.buildMarkdownReport());
  router.get('/audit/plain', async () => auditExporter.buildPlainTextReport());
  router.post('/audit/replay', async request => {
    const body = await parseJsonBody(request);
    return auditService.replay(Array.isArray(body.events) ? body.events : []);
  });
  router.get('/audit/context', async request => describeRequestContext(buildRequestContext(request)));

  registerProjectRoutes(router, projectService, reportService);
  registerWorkflowRoutes(router, workflowService);
  registerReportRoutes(router, reportService);
  registerAnalyticsRoutes(router, analyticsService);
  registerExportRoutes(router, exportService);

  router.post('/debug/project-preview', async request => validateProjectInput(await parseJsonBody(request)));
  router.post('/debug/scene-preview', async request => validateSceneInput(await parseJsonBody(request)));
  router.post('/debug/task-preview', async request => validateTaskInput(await parseJsonBody(request)));
  router.post('/debug/stage-preview', async request => {
    const body = await parseJsonBody(request);
    return { stageKey: validateStageKey(body.stageKey) };
  });
  router.post('/debug/batch-preview', async request => {
    const body = await parseJsonBody(request);
    return { projectIds: validateBatchProjectIds(body.projectIds) };
  });

  router.get('/serialize/projects', async request => payloadFactory.projectList(request.query));
  router.get('/serialize/projects/:id/card', async request => payloadFactory.projectCard(request.params.id));
  router.get('/serialize/projects/:id/detail', async request => payloadFactory.projectDetail(request.params.id));
  router.get('/serialize/workflow/:stageKey', async request => payloadFactory.stage(request.params.stageKey));
  router.get('/serialize/pipeline', async () => payloadFactory.pipeline());
  router.get('/serialize/summary', async () => payloadFactory.summary());
  router.get('/serialize/overview', async () => payloadFactory.overview());
  router.get('/serialize/snapshot', async () => payloadFactory.snapshot());
  router.get('/serialize/export/:projectId/package', async request => payloadFactory.exportPackage(request.params.projectId));
  router.get('/serialize/export/:projectId/manifest', async request => payloadFactory.exportManifest(request.params.projectId));
  router.get('/serialize/guide', async () => buildSerializationGuide());
  router.get('/serialize/routes', async () => buildRouteManifest());
  router.get('/serialize/fields/:id', async request => buildFieldMatrix(projectService.get(request.params.id)));

  router.use(async context => {
    throw new AppError('NOT_FOUND', `Route ${context.method} ${context.pathname} not found`, {
      pathname: context.pathname,
      method: context.method
    }, 404);
  });

  async function handle(request, response) {
    const requestContext = buildRequestContext(request);
    const traceHandle = requestTraceService.begin(requestContext);
    try {
      const result = await router.dispatch(request);
      await sendJson(response, 200, result);
      requestTraceService.end(traceHandle, { status: 200, context: { route: 'ok', ...requestContext } });
    } catch (error) {
      const normalized = normalizeError(error);
      await sendJson(response, normalized.status || 500, errorToJSON(normalized));
      requestTraceService.end(traceHandle, {
        status: normalized.status || 500,
        context: { errorCode: normalized.code, ...requestContext }
      });
    }
  }

  return {
    handle,
    projectService,
    workflowService,
    reportService,
    analyticsService,
    exportService,
    auditService,
    requestTraceService,
    auditExporter,
    payloadFactory,
    buildSerializationGuide,
    buildRouteManifest,
    buildFieldMatrix,
    router
  };
}
