import { buildTimelineWindow, daysBetween, formatDateTime, startOfDay } from '../utils/time.js';
import { createId, stableHash } from '../utils/id.js';

export class AnalyticsService {
  constructor(projectService) {
    this.projectService = projectService;
  }

  computeOverview() {
    const projects = this.projectService.list();
    const stats = this.projectService.statistics();
    const completionRate = stats.totalProjects === 0 ? 0 : Math.round((stats.generated / stats.totalProjects) * 100);
    const activeRate = stats.totalProjects === 0 ? 0 : Math.round(((stats.draft + stats.reviewing) / stats.totalProjects) * 100);

    return {
      generatedAt: formatDateTime(new Date()),
      totalProjects: stats.totalProjects,
      totalScenes: stats.totalScenes,
      totalTasks: stats.totalTasks,
      averageProgress: stats.averageProgress,
      completionRate,
      activeRate,
      score: this.buildScore(stats)
    };
  }

  buildScore(stats) {
    const base = stats.totalProjects * 12 + stats.totalScenes * 4 + stats.totalTasks * 2;
    const progressBonus = stats.averageProgress;
    return Math.min(1000, base + progressBonus);
  }

  buildTrendWindow(days = 7) {
    const window = buildTimelineWindow(days);
    const projects = this.projectService.list();
    const items = projects.map(project => ({
      id: project.id,
      updatedAt: project.updatedAt,
      dayOffset: daysBetween(window.start, project.updatedAt),
      progress: project.progress,
      status: project.status,
      priority: project.priority
    }));

    return {
      window,
      generatedAt: new Date().toISOString(),
      items
    };
  }

  buildStatusTrend() {
    const projects = this.projectService.list();
    const sorted = [...projects].sort((a, b) => String(a.updatedAt || '').localeCompare(String(b.updatedAt || '')));
    const buckets = sorted.reduce((acc, project) => {
      const key = project.status;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        id: project.id,
        title: project.title,
        progress: project.progress,
        priority: project.priority,
        updatedAt: project.updatedAt
      });
      return acc;
    }, {});

    return {
      generatedAt: new Date().toISOString(),
      buckets
    };
  }

  buildPriorityHeatmap() {
    const projects = this.projectService.list();
    const heatmap = projects.reduce((acc, project) => {
      const key = project.priority;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          progressSum: 0,
          sceneSum: 0,
          taskSum: 0
        };
      }
      acc[key].count += 1;
      acc[key].progressSum += project.progress;
      acc[key].sceneSum += project.sceneCount;
      acc[key].taskSum += project.taskCount;
      return acc;
    }, {});

    Object.keys(heatmap).forEach(key => {
      const bucket = heatmap[key];
      bucket.averageProgress = bucket.count === 0 ? 0 : Math.round(bucket.progressSum / bucket.count);
      bucket.averageScenes = bucket.count === 0 ? 0 : Math.round(bucket.sceneSum / bucket.count);
      bucket.averageTasks = bucket.count === 0 ? 0 : Math.round(bucket.taskSum / bucket.count);
    });

    return heatmap;
  }

  buildProjectRankings() {
    const projects = this.projectService.list();
    const ranking = [...projects].sort((a, b) => {
      if (b.progress !== a.progress) {
        return b.progress - a.progress;
      }
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    });

    return ranking.map((project, index) => ({
      rank: index + 1,
      id: project.id,
      title: project.title,
      progress: project.progress,
      status: project.status,
      priority: project.priority,
      hash: stableHash(`${project.id}|${project.title}|${index}`)
    }));
  }

  buildTimelineDigest(days = 7) {
    const window = buildTimelineWindow(days);
    const projects = this.projectService.list();
    const rows = projects
      .filter(project => project.updatedAt && startOfDay(project.updatedAt) >= window.start)
      .map(project => ({
        id: project.id,
        title: project.title,
        bucket: project.priority,
        status: project.status,
        progress: project.progress
      }));

    return {
      digestId: createId('digest'),
      window,
      rows,
      count: rows.length
    };
  }

  buildFocusMatrix() {
    const projects = this.projectService.list();
    return projects.reduce((acc, project) => {
      const key = `${project.status}:${project.priority}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        id: project.id,
        title: project.title,
        progress: project.progress,
        sceneCount: project.sceneCount
      });
      return acc;
    }, {});
  }

  buildInsights() {
    return {
      overview: this.computeOverview(),
      rankings: this.buildProjectRankings(),
      statusTrend: this.buildStatusTrend(),
      heatmap: this.buildPriorityHeatmap(),
      focusMatrix: this.buildFocusMatrix()
    };
  }
}
