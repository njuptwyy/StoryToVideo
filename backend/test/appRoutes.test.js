import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

function createMockResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(payload) {
      this.body = payload;
    }
  };
}

test('app boots with config and validation routes', async () => {
  const app = createApp();
  const response = createMockResponse();
  const request = {
    url: 'http://localhost/config',
    method: 'GET',
    headers: {}
  };

  await app.handle(request, response);

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.appName, 'StoryToVideo Backend');
});
