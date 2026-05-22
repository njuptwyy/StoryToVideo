import { AuditService } from './auditService.js';

export class RequestTraceService {
  constructor(auditService = new AuditService()) {
    this.auditService = auditService;
  }

  begin(request) {
    return {
      startedAt: Date.now(),
      method: request.method,
      pathname: request.pathname,
      correlationId: request.headers?.['x-correlation-id'] || null
    };
  }

  end(handle, result = {}) {
    const durationMs = Math.max(0, Date.now() - handle.startedAt);
    const trace = this.auditService.traceRequest({
      method: handle.method,
      pathname: handle.pathname,
      status: result.status || 200,
      durationMs,
      correlationId: handle.correlationId,
      context: result.context || {}
    });

    return {
      ...trace,
      durationMs
    };
  }

  annotate(handle, message, context = {}) {
    return this.auditService.logSystem(message, {
      pathname: handle.pathname,
      method: handle.method,
      ...context
    }, 'debug');
  }

  snapshot() {
    return this.auditService.getAuditSummary();
  }
}
