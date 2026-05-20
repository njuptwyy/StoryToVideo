<template>
  <div class="dashboard-container">
    <div class="action-header">
      <div class="welcome-text">
        <h2>工作台概览</h2>
        <p>在此管理您的故事编译项目，或开启一段新的创作。</p>
      </div>
      <button class="btn-primary" @click="goToCreateProject">
        <span class="icon">+</span> 新建故事项目
      </button>
    </div>

    <div class="metrics-grid">
      <div class="metric-card" v-for="item in metricsCards" :key="item.label">
        <span class="metric-value">{{ item.value }}</span>
        <span class="metric-label">{{ item.label }}</span>
        <span class="metric-hint">{{ item.hint }}</span>
      </div>
    </div>

    <div class="section-title">
      <h3>最近项目</h3>
    </div>
    
    <div class="project-grid">
      <div class="project-card" v-for="project in recentProjects" :key="project.id">
        <div class="card-header">
          <span class="status-tag success">{{ project.status }}</span>
          <span class="time-text">{{ project.date }}</span>
        </div>
        <div class="card-body">
          <h4>{{ project.name }}</h4>
          <p class="summary">{{ project.summary }}</p>
        </div>
        <div class="card-footer">
          <button class="btn-text">继续编辑</button>
          <button class="btn-text delete" @click="projectStore.deleteProject(project.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { projectStore } from '../store/projectStore'
import { getProjectDigest } from '../data/projectInsights'

const router = useRouter()

// 点击新建项目时的跳转逻辑
const goToCreateProject = () => {
  router.push('/project/create')
}

// 使用共享数据
const recentProjects = computed(() => projectStore.getRecentProjects())
const projectDigest = computed(() => getProjectDigest(projectStore.projects))

const metricsCards = computed(() => [
  {
    label: '总项目数',
    value: projectDigest.value.metrics.total,
    hint: `最近记录：${projectDigest.value.metrics.latestDate}`
  },
  {
    label: '已生成项目',
    value: projectDigest.value.metrics.generated,
    hint: `完成率 ${projectDigest.value.metrics.completionRate}%`
  },
  {
    label: '生成中任务',
    value: projectDigest.value.metrics.generating,
    hint: `待继续推进的项目`
  },
  {
    label: '异常项目',
    value: projectDigest.value.metrics.failed,
    hint: '需要回溯修复'
  }
])
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.welcome-text h2 { margin: 0 0 8px 0; color: #333; }
.welcome-text p { margin: 0; color: #666; font-size: 14px; }

.btn-primary {
  background: linear-gradient(to right, #3698F5, #3CB4D5);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}
.btn-primary:hover { opacity: 0.9; }

.section-title h3 { margin: 0; color: #333; border-left: 4px solid #D4A34B; padding-left: 10px; }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.metric-card {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e7eef8;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.metric-value {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
}

.metric-label {
  font-size: 14px;
  color: #4b5563;
  font-weight: 700;
}

.metric-hint {
  font-size: 12px;
  color: #6b7280;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-tag.success {
  background: #E8F5E9; color: #6CC24A; padding: 4px 8px; border-radius: 4px; font-size: 12px;
}
.time-text { font-size: 12px; color: #999; }

.card-body h4 { margin: 0 0 8px 0; color: #333; }
.card-body .summary { margin: 0; color: #666; font-size: 13px; line-height: 1.5; }

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
}
.btn-text {
  background: none; border: none; color: #3698F5; cursor: pointer; font-size: 14px;
}
.btn-text.delete { color: #F07A6D; }
</style>