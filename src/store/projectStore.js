import { reactive } from 'vue'

// 共享的项目数据
export const projectStore = reactive({
  projects: [
    { id: 1, name: '星际穿越狂想曲 - 预演 1', status: '已生成', date: '2026-04-16', summary: '包含 5 个角色，12 个场景，24 个独立分镜...' },
    { id: 2, name: '星际穿越狂想曲 - 预演 2', status: '已生成', date: '2026-04-16', summary: '包含 5 个角色，12 个场景，24 个独立分镜...' },
    { id: 3, name: '星际穿越狂想曲 - 预演 3', status: '已生成', date: '2026-04-16', summary: '包含 5 个角色，12 个场景，24 个独立分镜...' },
    { id: 4, name: '星际穿越狂想曲 - 预演 4', status: '已生成', date: '2026-04-16', summary: '包含 5 个角色，12 个场景，24 个独立分镜...' },
    { id: 5, name: '赛博朋克城市 - 预演 1', status: '已生成', date: '2026-04-15', summary: '包含 3 个角色，8 个场景，16 个独立分镜...' },
    { id: 6, name: '赛博朋克城市 - 预演 2', status: '生成中', date: '2026-04-15', summary: '包含 3 个角色，8 个场景，16 个独立分镜...' },
    { id: 7, name: '童话森林奇遇', status: '已生成', date: '2026-04-14', summary: '包含 4 个角色，6 个场景，12 个独立分镜...' },
    { id: 8, name: '深海探险日志', status: '已生成', date: '2026-04-13', summary: '包含 2 个角色，10 个场景，20 个独立分镜...' },
  ],
  
  // 获取最近项目（最新的4条）
  getRecentProjects() {
    return this.projects.slice(0, 4)
  },
  
  // 获取历史项目（除了最近4条之外的其他项目）
  getHistoryProjects() {
    return this.projects.slice(4)
  },
  
  // 删除项目
  deleteProject(id) {
    const index = this.projects.findIndex(p => p.id === id)
    if (index > -1) {
      this.projects.splice(index, 1)
    }
  }
})