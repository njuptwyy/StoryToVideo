import { serializeProjectCard, serializeProjectDetail, serializeProjectList, serializeStage, serializeSummary } from './serializers.js';
import { createId } from '../utils/id.js';

export function buildPayloadFactory({ projectService, workflowService, reportService, analyticsService, exportService }) {
  return {
    projectCard(projectId) {
      return serializeProjectCard(projectService.get(projectId));
    },
    projectDetail(projectId) {
      const project = projectService.get(projectId);
      return serializeProjectDetail(project, projectService.timeline(projectId));
    },
    projectList(filter = {}) {
      return serializeProjectList(projectService.list(filter));
    },
    stage(stageKey) {
      return serializeStage(workflowService.describeStage(stageKey), workflowService.getPipeline());
    },
    pipeline() {
      return workflowService.getPipeline().map(stage => serializeStage(stage, workflowService.getPipeline()));
    },
    summary() {
      return serializeSummary(projectService.statistics());
    },
    overview() {
      return {
        ...analyticsService.computeOverview(),
        referenceId: createId('overview')
      };
    },
    snapshot() {
      return reportService.buildSnapshot();
    },
    exportPackage(projectId) {
      return exportService.buildProjectPackage(projectId);
    },
    exportManifest(projectId) {
      return exportService.buildManifest(projectId);
    }
  };
}
