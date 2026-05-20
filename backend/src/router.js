import { ValidationError } from './core/errors.js';

function compilePath(pathname) {
  const keys = [];
  const pattern = pathname
    .split('/')
    .map(segment => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return {
    keys,
    regex: new RegExp(`^${pattern}$`)
  };
}

function parseQuery(url) {
  const result = {};
  url.searchParams.forEach((value, key) => {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const current = result[key];
      result[key] = Array.isArray(current) ? current.concat(value) : [current, value];
      return;
    }
    result[key] = value;
  });
  return result;
}

export function createRouter() {
  const routes = [];
  let fallback = null;

  function register(method, pathname, handler) {
    const compiled = compilePath(pathname);
    routes.push({
      method: method.toUpperCase(),
      pathname,
      handler,
      ...compiled
    });
  }

  return {
    get(pathname, handler) {
      register('GET', pathname, handler);
    },
    post(pathname, handler) {
      register('POST', pathname, handler);
    },
    patch(pathname, handler) {
      register('PATCH', pathname, handler);
    },
    delete(pathname, handler) {
      register('DELETE', pathname, handler);
    },
    use(handler) {
      fallback = handler;
    },
    async dispatch(request) {
      const url = new URL(request.url, 'http://localhost');
      const pathname = url.pathname;
      const method = request.method.toUpperCase();
      const query = parseQuery(url);

      for (const route of routes) {
        if (route.method !== method) {
          continue;
        }

        const match = route.regex.exec(pathname);
        if (!match) {
          continue;
        }

        const params = route.keys.reduce((acc, key, index) => {
          acc[key] = decodeURIComponent(match[index + 1]);
          return acc;
        }, {});

        return route.handler({
          request,
          method,
          pathname,
          query,
          params,
          headers: request.headers
        });
      }

      if (fallback) {
        return fallback({ request, method, pathname, query, params: {}, headers: request.headers });
      }

      throw new ValidationError(`No route matched ${method} ${pathname}`);
    }
  };
}

export async function parseJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  const payload = Buffer.concat(chunks).toString('utf8').trim();
  if (!payload) {
    return {};
  }
  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new ValidationError('Request body must be valid JSON', { error: error.message });
  }
}

export function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload, null, 2));
}
