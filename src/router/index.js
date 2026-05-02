import { createRouter, createWebHistory } from 'vue-router'

// 引入外壳布局
import BaseLayout from '../layouts/BaseLayout.vue'
import WorkspaceLayout from '../layouts/WorkspaceLayout.vue'

// 引入内页组件
import Dashboard from '../views/Dashboard.vue'
import ProjectCreate from '../views/ProjectCreate.vue'
import StoryStructure from '../views/StoryStructure.vue'
import CharacterSettings from '../views/CharacterSettings.vue'
import SceneSettings from '../views/SceneSettings.vue'
import Storyboard from '../views/Storyboard.vue'
import GeneratingTask from '../views/GeneratingTask.vue'
import KeyframeResults from '../views/KeyframeResults.vue'
import ConsistencyCheck from '../views/ConsistencyCheck.vue'
import ProjectPreview from '../views/ProjectPreview.vue'
import ShotDetail from '../views/ShotDetail.vue'
import History from '../views/History.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'history', component: History },
      { path: 'settings', component: Settings }
    ]
  },
  {
    path: '/project',
    component: WorkspaceLayout,
    children: [
      { path: 'create', component: ProjectCreate },
      { path: ':id/structure', component: StoryStructure },
      { path: ':id/characters', component: CharacterSettings },
      { path: ':id/scenes', component: SceneSettings } ,
      { path: ':id/storyboard', component: Storyboard },
      { path: ':id/generating', component: GeneratingTask },
      { path: ':id/results', component: KeyframeResults },
      { path: ':id/qa-check', component: ConsistencyCheck },
      { path: ':id/preview', component: ProjectPreview },
      { path: ':id/shot/:shotId', component: ShotDetail }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 🌟 添加下面这段控制滚动行为的代码
  scrollBehavior(to, from, savedPosition) {
    // 如果用户使用了浏览器的“后退/前进”按钮，且浏览器记录了之前的位置，就回到之前的位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则，无论是新跳转还是点击普通链接，一律平滑滚动回页面最顶部
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router