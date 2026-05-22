import { formatDateTime } from '../utils/time.js';

export function formatProjectSummary(project) {
  return [
    `项目：${project.title}`,
    `状态：${project.status}`,
    `优先级：${project.priority}`,
    `进度：${project.progress}%`,
    `场景：${project.sceneCount}`,
    `任务：${project.taskCount}`,
    `更新时间：${formatDateTime(project.updatedAt)}`
  ].join('\n');
}

export function formatOverviewSummary(overview) {
  return [
    `总项目数：${overview.totalProjects}`,
    `总场景数：${overview.totalScenes}`,
    `总任务数：${overview.totalTasks}`,
    `平均进度：${overview.averageProgress}%`,
    `完成率：${overview.completionRate}%`,
    `活跃率：${overview.activeRate}%`,
    `综合评分：${overview.score}`
  ].join('\n');
}

export function formatRankingList(rankings = []) {
  return rankings.slice(0, 5).map(item => `${item.rank}. ${item.title} (${item.progress}%)`).join('\n');
}

export function formatPipelineList(pipeline = []) {
  return pipeline.map(step => `${step.order}. ${step.name}`).join('\n');
}
