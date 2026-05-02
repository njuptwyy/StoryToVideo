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
import { useRouter } from 'vue-router'
import { projectStore } from '../store/projectStore'

const router = useRouter()

// 点击新建项目时的跳转逻辑
const goToCreateProject = () => {
  router.push('/project/create')
}

// 使用共享数据
const recentProjects = projectStore.getRecentProjects()
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