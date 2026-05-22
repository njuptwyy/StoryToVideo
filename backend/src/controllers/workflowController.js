import { parseJsonBody } from '../router.js';

export function registerWorkflowRoutes(router, workflowService) {
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
}
