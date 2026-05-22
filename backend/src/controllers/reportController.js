export function registerReportRoutes(router, reportService) {
  router.get('/reports/status', async () => reportService.buildStatusMatrix());
  router.get('/reports/priority', async () => reportService.buildPriorityMatrix());
  router.get('/reports/audit', async () => reportService.buildAuditSummary());
  router.get('/reports/export/:projectId', async request => reportService.buildExportBundle(request.params.projectId));
  router.get('/summary', async () => reportService.buildSnapshot());
  router.get('/overview', async () => reportService.buildOverview());
  router.get('/daily-brief', async () => reportService.buildDailyBrief());
}
