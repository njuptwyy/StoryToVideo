<template>
  <div class="workspace-layout">
    <header class="workspace-header">
      <div class="left-action">
        <button class="back-btn" @click="goBack">← 返回工作台</button>
      </div>
      <div class="step-indicator">
        <span>故事输入</span> ➜ <span class="dim">角色/场景设定</span> ➜ <span class="dim">分镜规划</span> ➜ <span class="dim">结果生成</span>
      </div>
    </header>

    <main class="workspace-content">
      <router-view></router-view>
    </main>
  </div>

  <div class="pipeline-strip">
    <span
      v-for="step in storyPipeline"
      :key="step.id"
      class="pipeline-step"
      :class="{ active: activeStep === step.id }"
    >
      {{ step.label }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resolvePipelineStep, storyPipeline } from '../data/storyPipeline'

const router = useRouter()
const route = useRoute()

const activeStep = computed(() => resolvePipelineStep(route.path))

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.workspace-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F8F9FA;
}

.workspace-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #E4E7ED;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
}

.back-btn {
  background: none; border: none; color: #666; font-size: 14px; cursor: pointer;
}
.back-btn:hover { color: #3698F5; }

.step-indicator {
  font-size: 14px; color: #333; font-weight: bold;
}
.step-indicator .dim {
  color: #999; font-weight: normal;
}

.pipeline-strip {
  padding: 14px 24px 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  color: #666;
  font-size: 13px;
}

.pipeline-step {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #E4E7ED;
  background: #fff;
  transition: all 0.2s ease;
}

.pipeline-step.active {
  background: linear-gradient(135deg, #3698F5, #3CB4D5);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 16px rgba(54, 152, 245, 0.18);
}

.workspace-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>