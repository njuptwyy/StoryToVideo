export const storyPipeline = [
  {
    id: 'create',
    label: '故事输入',
    routeKey: 'create',
    description: '输入故事文本与项目基础信息'
  },
  {
    id: 'structure',
    label: '结构解析',
    routeKey: 'structure',
    description: '抽取角色、场景、事件与情绪'
  },
  {
    id: 'settings',
    label: '角色/场景设定',
    routeKey: ['characters', 'scenes'],
    description: '修订角色与场景约束'
  },
  {
    id: 'storyboard',
    label: '分镜规划',
    routeKey: 'storyboard',
    description: '生成镜头级 storyboard'
  },
  {
    id: 'generation',
    label: '结果生成',
    routeKey: ['generating', 'results', 'qa-check', 'preview', 'shot'],
    description: '关键帧生成、校验与预览'
  }
]

export function resolvePipelineStep(path) {
  return storyPipeline.find((step) => {
    if (Array.isArray(step.routeKey)) {
      return step.routeKey.some((key) => path.includes(key))
    }

    return path.includes(step.routeKey)
  })?.id || 'create'
}

export function getPipelineSummary() {
  return storyPipeline.map(({ id, label, description }) => ({ id, label, description }))
}
