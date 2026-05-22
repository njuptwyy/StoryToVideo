import { parseJsonBody } from '../router.js';

export function registerExportRoutes(router, exportService) {
  router.get('/exports/package/:projectId', async request => exportService.buildProjectPackage(request.params.projectId));
  router.get('/exports/manifest/:projectId', async request => exportService.buildManifest(request.params.projectId));
  router.post('/exports/batch', async request => {
    const body = await parseJsonBody(request);
    return exportService.buildBatchExport(Array.isArray(body.projectIds) ? body.projectIds : []);
  });
  router.get('/exports/archive', async () => exportService.buildArchiveIndex());
  router.get('/exports/snapshot', async () => exportService.buildSnapshotBundle());
}
