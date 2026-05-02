<template>
  <div class="history-page">
    <div class="page-header">
      <h2>历史仓库</h2>
      <p>查看您过往创建的所有故事项目</p>
    </div>
    
    <!-- 最新的4条项目（与"最近项目"同步） -->
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
    
    <!-- 第5条及之后的所有项目 -->
    <div class="project-grid" v-if="olderProjects.length > 0">
      <div class="project-card" v-for="project in olderProjects" :key="project.id">
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
    
    <div v-if="projectStore.projects.length === 0" class="empty-state">
      <p>暂无历史项目</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { projectStore } from '../store/projectStore'

// 获取最新的4条项目
const recentProjects = computed(() => projectStore.getRecentProjects())

// 获取更早的项目（第5条及之后）
const olderProjects = computed(() => projectStore.getHistoryProjects())
</script>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #333;
  border-left: 4px solid #D4A34B;
  padding-left: 10px;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
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
  background: #E8F5E9;
  color: #6CC24A;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.time-text {
  font-size: 12px;
  color: #999;
}

.card-body h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.card-body .summary {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
}

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
}

.btn-text {
  background: none;
  border: none;
  color: #3698F5;
  cursor: pointer;
  font-size: 14px;
}

.btn-text.delete {
  color: #F07A6D;
}

.btn-text:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>