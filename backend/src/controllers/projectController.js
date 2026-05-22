import { parseJsonBody } from '../router.js';

export function registerProjectRoutes(router, projectService, reportService) {
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
}
