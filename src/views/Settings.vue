<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>系统设置</h2>
      <p>配置您的个人偏好和系统选项</p>
    </div>
    
    <div class="settings-section">
      <h3>账户设置</h3>
      <div class="setting-item">
        <label>用户名</label>
        <input type="text" placeholder="请输入用户名" />
      </div>
      <div class="setting-item">
        <label>邮箱</label>
        <input type="email" placeholder="请输入邮箱" />
      </div>
    </div>
    
    <div class="settings-section">
      <h3>显示设置</h3>
      <div class="setting-item">
        <label>主题</label>
        <select>
          <option>浅色模式</option>
          <option>深色模式</option>
          <option>跟随系统</option>
        </select>
      </div>
    </div>
    
    <div class="settings-actions">
      <button class="btn-primary" @click="saveSettings">保存设置</button>
    </div>
    
    <!-- 保存成功弹窗 -->
    <div v-if="showSuccess" class="modal-overlay" @click="showSuccess = false">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">✓</div>
        <h3>保存成功</h3>
        <p>您的设置已成功保存</p>
        <button class="btn-confirm" @click="showSuccess = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSuccess = ref(false)

const saveSettings = () => {
  showSuccess.value = true
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 600px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin-bottom: 8px;
  color: #333;
}

.page-header p {
  color: #666;
}

.settings-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.settings-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.setting-item input,
.setting-item select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.settings-actions {
  margin-top: 20px;
}

.btn-primary {
  background: #3698F5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #2575cc;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-icon {
  width: 60px;
  height: 60px;
  background: #6CC24A;
  color: white;
  font-size: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 20px;
}

.modal-content p {
  margin: 0 0 24px 0;
  color: #666;
}

.btn-confirm {
  background: #3698F5;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #2575cc;
}
</style>