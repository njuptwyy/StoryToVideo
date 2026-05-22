export const defaultConfig = {
  appName: 'StoryToVideo Backend',
  version: '1.0.0',
  host: '0.0.0.0',
  port: 3456,
  requestTimeoutMs: 15000,
  logLevel: 'info',
  features: {
    analytics: true,
    export: true,
    workflow: true,
    reports: true
  }
};

export const configProfiles = {
  development: {
    logLevel: 'debug',
    requestTimeoutMs: 30000
  },
  test: {
    logLevel: 'silent',
    requestTimeoutMs: 5000
  },
  production: {
    logLevel: 'warn',
    requestTimeoutMs: 10000
  }
};

export const configSchema = {
  appName: 'string',
  version: 'string',
  host: 'string',
  port: 'number',
  requestTimeoutMs: 'number',
  logLevel: 'string',
  features: 'object'
};
