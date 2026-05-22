import { AppError, errorToJSON, normalizeError } from './core/errors.js';
import { ProjectService } from './services/projectService.js';
import { WorkflowService } from './services/workflowService.js';
import { ReportService } from './services/reportService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { ExportService } from './services/exportService.js';
import { parseJsonBody, sendJson, createRouter } from './router.js';
import { createRuntimeConfig, describeConfig } from './config/loader.js';
import {
  validateProjectInput,
  validateSceneInput,
  validateTaskInput,
  validateStageKey,
  validateBatchProjectIds,
  summarizeValidationRules
} from './validation/index.js';

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

  router.get('/summary', async () => reportService.buildSnapshot());
  router.get('/overview', async () => reportService.buildOverview());
  router.get('/daily-brief', async () => reportService.buildDailyBrief());
  router.get('/projects', async request => projectService.list(request.query));
  router.get('/projects/:id', async request => projectService.get(request.params.id));
  router.post('/projects', async request => projectService.create(await parseJsonBody(request)));
  router.patch('/projects/:id', async request => projectService.update(request.params.id, await parseJsonBody(request)));
  router.delete('/projects/:id', async request => projectService.remove(request.params.id));
  router.get('/projects/:id/detail', async request => reportService.buildProjectDetail(request.params.id));
  router.get('/projects/:id/card', async request => reportService.buildProjectCard(request.params.id));
  router.get('/projects/:id/timeline', async request => projectService.timeline(request.params.id));
  router.post('/projects/:id/status', async request => {
    const body = await parseJsonBody(request);
    return projectService.markStatus(request.params.id, body.status);
  });
  router.post('/projects/:id/scenes', async request => {
    const body = await parseJsonBody(request);
    return projectService.addScene(request.params.id, body);
  });
  router.post('/projects/:id/tasks', async request => {
    const body = await parseJsonBody(request);
    return projectService.addTask(request.params.id, body);
  });
  router.patch('/projects/:projectId/tasks/:taskId', async request => {
    const body = await parseJsonBody(request);
    return projectService.patchTask(request.params.projectId, request.params.taskId, body);
  });
  router.get('/workflow/pipeline', async () => workflowService.getPipeline());
  router.get('/workflow/narrative', async () => workflowService.getNarrative());
  router.get('/workflow/:stageKey', async request => workflowService.describeStage(request.params.stageKey));
  router.post('/workflow/:projectId/advance/:stageKey', async request => {
    const body = await parseJsonBody(request);
    return workflowService.advance(request.params.projectId, request.params.stageKey, body);
  });
  router.post('/workflow/:projectId/rewind/:stageKey', async request => workflowService.rewind(request.params.projectId, request.params.stageKey));
  router.post('/workflow/:projectId/checklist', async request => workflowService.syncChecklist(request.params.projectId));
  router.get('/workflow/:projectId/report', async request => workflowService.buildProgressReport(request.params.projectId));
  router.get('/reports/status', async () => reportService.buildStatusMatrix());
  router.get('/reports/priority', async () => reportService.buildPriorityMatrix());
  router.get('/reports/audit', async () => reportService.buildAuditSummary());
  router.get('/reports/export/:projectId', async request => reportService.buildExportBundle(request.params.projectId));
  router.get('/analytics/overview', async () => analyticsService.computeOverview());
  router.get('/analytics/trend/:days', async request => analyticsService.buildTrendWindow(Number(request.params.days || 7)));
  router.get('/analytics/status-trend', async () => analyticsService.buildStatusTrend());
  router.get('/analytics/heatmap', async () => analyticsService.buildPriorityHeatmap());
  router.get('/analytics/rankings', async () => analyticsService.buildProjectRankings());
  router.get('/analytics/insights', async () => analyticsService.buildInsights());
  router.get('/exports/package/:projectId', async request => exportService.buildProjectPackage(request.params.projectId));
  router.get('/exports/manifest/:projectId', async request => exportService.buildManifest(request.params.projectId));
  router.post('/exports/batch', async request => {
    const body = await parseJsonBody(request);
    return exportService.buildBatchExport(Array.isArray(body.projectIds) ? body.projectIds : []);
  });
  router.get('/exports/archive', async () => exportService.buildArchiveIndex());
  router.get('/exports/snapshot', async () => exportService.buildSnapshotBundle());

  router.get('/config', async () => describeConfig(runtimeConfig));
  router.get('/validation/rules', async () => summarizeValidationRules());

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
