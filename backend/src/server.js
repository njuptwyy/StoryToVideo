import http from 'node:http';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT || 3456);
const HOST = process.env.HOST || '0.0.0.0';

export function startServer(options = {}) {
  const port = Number(options.port || PORT);
  const host = options.host || HOST;
  const app = createApp();

  const server = http.createServer((request, response) => {
    app.handle(request, response);
  });

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`[backend] story-to-video mock backend running at http://${host}:${actualPort}`);
  });

  return { server, app };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
