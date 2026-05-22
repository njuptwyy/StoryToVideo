import { ProjectService } from './services/projectService.js';
import { WorkflowService } from './services/workflowService.js';
import { ReportService } from './services/reportService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { ExportService } from './services/exportService.js';
import { formatProjectSummary, formatOverviewSummary, formatRankingList, formatPipelineList } from './presentation/consolePresenter.js';

export function createCliContext() {
  const projectService = new ProjectService();
  const workflowService = new WorkflowService(projectService);
  const reportService = new ReportService(projectService);
  const analyticsService = new AnalyticsService(projectService);
  const exportService = new ExportService(projectService, analyticsService, reportService);

  projectService.seed();

  return {
    projectService,
    workflowService,
    reportService,
    analyticsService,
    exportService
  };
}

export function buildCliSummary() {
  const context = createCliContext();
  const overview = context.analyticsService.computeOverview();
  const rankings = context.analyticsService.buildProjectRankings();
  const pipeline = context.workflowService.getPipeline();
  const [firstProject] = context.projectService.list();
  const projectCard = firstProject ? context.reportService.buildProjectCard(firstProject.id) : null;

  return {
    overview: formatOverviewSummary(overview),
    rankings: formatRankingList(rankings),
    pipeline: formatPipelineList(pipeline),
    project: projectCard ? formatProjectSummary(projectCard) : '暂无项目',
    exportPreview: firstProject ? context.exportService.buildManifest(firstProject.id) : null
  };
}

export function runCli(logger = console.log) {
  const summary = buildCliSummary();
  logger('=== Overview ===');
  logger(summary.overview);
  logger('=== Rankings ===');
  logger(summary.rankings);
  logger('=== Pipeline ===');
  logger(summary.pipeline);
  logger('=== Sample Project ===');
  logger(summary.project);
  return summary;
}
