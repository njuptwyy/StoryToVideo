import { createSequenceId, createSlug, stableHash } from '../utils/id.js';

export const workflowStages = [
  {
    key: 'intake',
    name: '故事输入',
    icon: '📝',
    summary: '接收长文本并拆分为可处理的故事单元。',
    checkpoints: ['文本清洗', '章节识别', '主题词提取'],
    outputs: ['story-outline', 'topic-map']
  },
  {
    key: 'structure',
    name: '结构拆分',
    icon: '🧩',
    summary: '把叙事内容组织成章节、场景与段落。',
    checkpoints: ['章节切片', '场景边界', '冲突识别'],
    outputs: ['chapter-tree', 'scene-tree']
  },
  {
    key: 'character',
    name: '人物设定',
    icon: '👤',
    summary: '沉淀角色标签、关系和关键行为模式。',
    checkpoints: ['角色卡片', '关系图谱', '性格提要'],
    outputs: ['character-sheet', 'relation-map']
  },
  {
    key: 'scene',
    name: '场景规划',
    icon: '🏞️',
    summary: '为每个场景指定环境、镜头和氛围标签。',
    checkpoints: ['场景标签', '镜头建议', '氛围说明'],
    outputs: ['scene-plan', 'camera-hints']
  },
  {
    key: 'storyboard',
    name: '分镜生成',
    icon: '🎬',
    summary: '以镜头列表的形式输出预演分镜。',
    checkpoints: ['镜头序列', '节奏节拍', '视觉提示'],
    outputs: ['shot-list', 'preview-grid']
  },
  {
    key: 'generate',
    name: '素材生成',
    icon: '⚙️',
    summary: '汇总任务并生成关键帧与辅助素材。',
    checkpoints: ['任务编排', '素材对齐', '生成状态'],
    outputs: ['render-task', 'asset-pack']
  },
  {
    key: 'review',
    name: '一致性校验',
    icon: '✅',
    summary: '检查前后设定是否冲突，给出修正建议。',
    checkpoints: ['设定一致性', '风格一致性', '命名一致性'],
    outputs: ['review-report', 'fix-suggestions']
  },
  {
    key: 'export',
    name: '结果导出',
    icon: '📦',
    summary: '导出项目结果、文本摘要和归档信息。',
    checkpoints: ['结果归档', '文档打包', '导出记录'],
    outputs: ['export-bundle', 'archive-manifest']
  }
];

export const outputFamilies = [
  { key: 'outline', label: '大纲类', purpose: '支持章节与内容提纲' },
  { key: 'character', label: '人物类', purpose: '支持角色卡与关系图' },
  { key: 'scene', label: '场景类', purpose: '支持环境描述与镜头设计' },
  { key: 'shot', label: '镜头类', purpose: '支持分镜列表与镜头注释' },
  { key: 'asset', label: '素材类', purpose: '支持关键帧、参考图与导出包' },
  { key: 'report', label: '报告类', purpose: '支持一致性检查与审阅文档' }
];

export const characterArchetypes = [
  '主角',
  '反派',
  '导师',
  '助手',
  '守门人',
  '旁观者',
  '记者',
  '管理员',
  '工程师',
  '艺术家',
  '医生',
  '学生',
  '父亲',
  '母亲',
  '伙伴',
  '对手',
  '线人',
  '发明家',
  '商人',
  '侦探',
  '警官',
  '诗人',
  '游客'
];

export const sceneEnvironments = [
  '城市天台',
  '深夜街道',
  '图书馆',
  '旧车站',
  '海边码头',
  '实验室',
  '山间公路',
  '地下通道',
  '学校走廊',
  '剧院后台',
  '咖啡馆',
  '废弃仓库'
];

export const shotStyles = [
  '全景',
  '中景',
  '近景',
  '特写',
  '俯拍',
  '仰拍',
  '推镜头',
  '拉镜头',
  '摇镜头',
  '跟镜头',
  '定镜头',
  '手持感'
];

export const themeTags = [
  '成长',
  '冒险',
  '悬疑',
  '温情',
  '对抗',
  '协作',
  '科幻',
  '现实',
  '治愈',
  '未来',
  '回忆',
  '重逢',
  '追逐',
  '探索',
  '逆转'
];

export const sampleProjectBlueprints = [
  {
    name: '晨雾中的约定',
    theme: ['温情', '回忆'],
    scene: '海边码头',
    character: '主角',
    shots: 8,
    priority: 'high'
  },
  {
    name: '无人的灯塔',
    theme: ['悬疑', '探索'],
    scene: '旧车站',
    character: '侦探',
    shots: 10,
    priority: 'medium'
  },
  {
    name: '夜航实验室',
    theme: ['科幻', '对抗'],
    scene: '实验室',
    character: '工程师',
    shots: 12,
    priority: 'high'
  },
  {
    name: '校园回声',
    theme: ['成长', '治愈'],
    scene: '学校走廊',
    character: '学生',
    shots: 7,
    priority: 'low'
  },
  {
    name: '剧院最后一幕',
    theme: ['重逢', '温情'],
    scene: '剧院后台',
    character: '艺术家',
    shots: 9,
    priority: 'medium'
  },
  {
    name: '地下通道的消息',
    theme: ['悬疑', '追逐'],
    scene: '地下通道',
    character: '线人',
    shots: 11,
    priority: 'high'
  }
];

export function buildStageNavigation() {
  return workflowStages.map((stage, index) => ({
    order: index + 1,
    id: createSequenceId('stage', index),
    ...stage
  }));
}

export function findStageByKey(key) {
  return workflowStages.find(stage => stage.key === key) || null;
}

export function findStageIndexByKey(key) {
  return workflowStages.findIndex(stage => stage.key === key);
}

export function getNextStage(key) {
  const index = findStageIndexByKey(key);
  if (index < 0 || index >= workflowStages.length - 1) {
    return null;
  }
  return workflowStages[index + 1];
}

export function getPreviousStage(key) {
  const index = findStageIndexByKey(key);
  if (index <= 0) {
    return null;
  }
  return workflowStages[index - 1];
}

export function createBlueprintDigest(blueprint) {
  const name = blueprint?.name || 'untitled';
  const scene = blueprint?.scene || 'unknown';
  const theme = Array.isArray(blueprint?.theme) ? blueprint.theme.join(',') : 'none';
  return stableHash(`${name}|${scene}|${theme}`);
}

export function buildBlueprintIndex() {
  return sampleProjectBlueprints.map((blueprint, index) => ({
    id: createSequenceId('blueprint', index),
    slug: createSlug(blueprint.name),
    digest: createBlueprintDigest(blueprint),
    ...blueprint
  }));
}

export function summarizeCatalog() {
  return {
    stageCount: workflowStages.length,
    familyCount: outputFamilies.length,
    archetypeCount: characterArchetypes.length,
    environmentCount: sceneEnvironments.length,
    styleCount: shotStyles.length,
    themeCount: themeTags.length,
    blueprintCount: sampleProjectBlueprints.length
  };
}

export function findThemeMatch(tag) {
  const normalized = String(tag || '').trim();
  if (!normalized) {
    return [];
  }
  return themeTags.filter(item => item.includes(normalized) || normalized.includes(item));
}

export function listCatalogNarrative() {
  return workflowStages.map(stage => ({
    stage: stage.name,
    summary: stage.summary,
    outputs: stage.outputs.join('、')
  }));
}
