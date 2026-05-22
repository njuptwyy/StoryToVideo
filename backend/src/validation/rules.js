export const ruleSet = {
  projectTitle: {
    minLength: 3,
    maxLength: 80,
    pattern: /^[\p{L}\p{N}\s\-_:，。！？、()（）]+$/u
  },
  sceneTitle: {
    minLength: 2,
    maxLength: 60
  },
  taskName: {
    minLength: 2,
    maxLength: 80
  },
  priority: ['low', 'medium', 'high'],
  status: ['draft', 'reviewing', 'generated', 'archived'],
  stageKey: ['intake', 'structure', 'character', 'scene', 'storyboard', 'generate', 'review', 'export']
};

export function listRuleNames() {
  return Object.keys(ruleSet);
}

export function getRule(name) {
  return ruleSet[name] || null;
}

export function hasRule(name) {
  return Object.prototype.hasOwnProperty.call(ruleSet, name);
}
