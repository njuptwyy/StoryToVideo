export function registerAnalyticsRoutes(router, analyticsService) {
  router.get('/analytics/overview', async () => analyticsService.computeOverview());
  router.get('/analytics/trend/:days', async request => analyticsService.buildTrendWindow(Number(request.params.days || 7)));
  router.get('/analytics/status-trend', async () => analyticsService.buildStatusTrend());
  router.get('/analytics/heatmap', async () => analyticsService.buildPriorityHeatmap());
  router.get('/analytics/rankings', async () => analyticsService.buildProjectRankings());
  router.get('/analytics/insights', async () => analyticsService.buildInsights());
}
