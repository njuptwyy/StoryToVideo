<template>
  <div class="base-layout">
    <aside class="sidebar">
      <div class="brand-logo">
        <h2>Story Compiler</h2>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/dashboard" class="menu-item" active-class="active">
          <i class="icon-home"></i> 首页工作台
        </router-link>
        
        <router-link to="/history" class="menu-item" active-class="active">
          <i class="icon-history"></i> 历史仓库
        </router-link>
        
        <router-link to="/settings" class="menu-item" active-class="active">
          <i class="icon-settings"></i> 系统设置
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-banner">
        <h1>网络安全测试平台 / 故事编译系统</h1>
      </header>

      <div class="page-container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 引入之前定义的全局 CSS 变量 */
.base-layout {
  display: flex;
  height: 100vh; /* 撑满整个屏幕高度 */
  background-color: var(--bg-main, #F4F6F9);
}

.sidebar {
  width: 240px;
  background-color: var(--bg-sidebar, #2F3542);
  color: white;
  display: flex;
  flex-direction: column;
}

.brand-logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.menu-item {
  padding: 15px 20px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: all 0.3s;
}

.menu-item:hover, .menu-item.active {
  background-color: rgba(0,0,0,0.2);
  color: var(--text-sidebar-active, #D4A34B);
  border-left: 4px solid var(--text-sidebar-active, #D4A34B);
}

.main-content {
  flex: 1; /* 占据剩余全部宽度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-banner {
  height: 120px;
  background: var(--hero-gradient, linear-gradient(to right, #3698F5, #6CC24A));
  color: white;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.page-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* 内容过多时可滚动 */
}
</style>