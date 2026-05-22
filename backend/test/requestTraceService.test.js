import test from 'node:test';
import assert from 'node:assert/strict';
import { RequestTraceService } from '../src/services/requestTraceService.js';

test('request trace service produces trace records', () => {
  const service = new RequestTraceService();
  const handle = service.begin({
    method: 'POST',
    pathname: '/projects',
    headers: { 'x-correlation-id': 'cid-1' }
  });
  const trace = service.end(handle, { status: 201, context: { route: 'created' } });

  assert.equal(trace.method, 'POST');
  assert.equal(trace.pathname, '/projects');
  assert.equal(trace.status, 201);
  assert.ok(trace.durationMs >= 0);
});
