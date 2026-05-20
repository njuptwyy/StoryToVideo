# 架构概览

## 前端结构

Story Compiler 当前采用 Vue 3 + Vite 实现，前端主要分为以下层次：

- 路由层：统一管理工作台与项目工作流页面
- 布局层：`BaseLayout` 与 `WorkspaceLayout` 负责壳层和步骤导航
- 视图层：`Dashboard`、`ProjectCreate`、`StoryStructure`、`CharacterSettings`、`SceneSettings`、`Storyboard`、`GeneratingTask`、`KeyframeResults`、`ConsistencyCheck`、`ProjectPreview`、`ShotDetail`
- 状态层：`projectStore` 提供历史项目与最近项目数据

## 设计原则

- 流程可视化：将长文本创作拆分为清晰的阶段
- 结果可编辑：支持角色、场景、分镜和镜头级修改
- 预演优先：先形成可预览的视觉表达，再考虑导出
- 组件化：页面按功能拆分，便于后续接入真实后端接口

## 当前工作流

故事输入 → 结构解析 → 角色设定 → 场景设定 → 分镜规划 → 关键帧生成 → 一致性检查 → 最终预览
