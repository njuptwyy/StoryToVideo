import { createId } from '../utils/id.js';

export function getHeader(request, name) {
  const headers = request?.headers || {};
  const normalized = String(name).toLowerCase();
  if (headers[normalized] !== undefined) {
    return headers[normalized];
  }
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === normalized);
  return entry ? entry[1] : null;
}

export function buildRequestContext(request) {
  const url = new URL(request.url, 'http://localhost');
  return {
    method: request.method,
    pathname: url.pathname,
    search: url.search,
    correlationId: getHeader(request, 'x-correlation-id') || createId('corr'),
    userAgent: getHeader(request, 'user-agent') || 'unknown',
    origin: getHeader(request, 'origin') || 'unknown',
    referer: getHeader(request, 'referer') || 'unknown'
  };
}

export function describeRequestContext(context) {
  return {
    method: context.method,
    pathname: context.pathname,
    correlationId: context.correlationId,
    userAgent: context.userAgent,
    origin: context.origin
  };
}
