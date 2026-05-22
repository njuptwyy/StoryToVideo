import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequestContext, describeRequestContext } from '../src/core/requestContext.js';

test('request context builder reads headers and url data', () => {
  const context = buildRequestContext({
    method: 'GET',
    url: 'http://localhost/audit/context?view=full',
    headers: {
      'x-correlation-id': 'cid-77',
      'user-agent': 'test-agent',
      origin: 'http://localhost:3000'
    }
  });

  const described = describeRequestContext(context);

  assert.equal(context.pathname, '/audit/context');
  assert.equal(context.correlationId, 'cid-77');
  assert.equal(described.userAgent, 'test-agent');
  assert.equal(described.origin, 'http://localhost:3000');
});
