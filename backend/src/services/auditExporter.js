export class AuditExporter {
  constructor(auditService) {
    this.auditService = auditService;
  }

  buildMarkdownReport() {
    const dashboard = this.auditService.buildDashboard();
    const summary = this.auditService.getAuditSummary();

    const lines = [
      '# Audit Report',
      '',
      `- Total audit records: ${summary.records.total}`,
      `- Total request traces: ${summary.traces.total}`,
      `- Logger level counts: ${JSON.stringify(dashboard.levels)}`,
      '',
      '## Latest Records',
      ...dashboard.records.slice(0, 5).map(item => `- ${item.action} :: ${item.message}`),
      '',
      '## Latest Traces',
      ...dashboard.traces.slice(0, 5).map(item => `- ${item.method} ${item.pathname} (${item.status})`)
    ];

    return lines.join('\n');
  }

  buildPlainTextReport() {
    const markdown = this.buildMarkdownReport();
    return markdown.replace(/^# /gm, '').replace(/^## /gm, '').replace(/^- /gm, '* ');
  }
}
