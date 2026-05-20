const statusWeight = {
  '已生成': 3,
  '生成中': 2,
  '待处理': 1,
  '失败': 0
}

export function getProjectMetrics(projects = []) {
  const total = projects.length
  const generated = projects.filter((project) => project.status === '已生成').length
  const generating = projects.filter((project) => project.status === '生成中').length
  const failed = projects.filter((project) => project.status === '失败').length
  const latestDate = projects[0]?.date || 'N/A'
  const oldestDate = projects.at(-1)?.date || 'N/A'

  return {
    total,
    generated,
    generating,
    failed,
    latestDate,
    oldestDate,
    completionRate: total ? Math.round((generated / total) * 100) : 0
  }
}

export function getStatusBreakdown(projects = []) {
  return projects.reduce((acc, project) => {
    const key = project.status || '待处理'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

export function sortProjectsByPriority(projects = []) {
  return [...projects].sort((a, b) => {
    const weightA = statusWeight[a.status] ?? 0
    const weightB = statusWeight[b.status] ?? 0

    if (weightA !== weightB) return weightB - weightA
    return String(b.date).localeCompare(String(a.date))
  })
}

export function buildProjectTimeline(projects = []) {
  return [...projects]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      date: project.date,
      summary: project.summary
    }))
}

export function getProjectDigest(projects = []) {
  const metrics = getProjectMetrics(projects)
  const breakdown = getStatusBreakdown(projects)

  return {
    metrics,
    breakdown,
    priorityProjects: sortProjectsByPriority(projects).slice(0, 3),
    timeline: buildProjectTimeline(projects)
  }
}
