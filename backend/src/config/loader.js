import { defaultConfig, configProfiles } from './defaults.js';

function deepMerge(base, patch) {
  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.entries(patch || {}).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && output[key] && typeof output[key] === 'object' && !Array.isArray(output[key])) {
      output[key] = deepMerge(output[key], value);
      return;
    }
    output[key] = value;
  });

  return output;
}

export function loadConfig(env = process.env) {
  const profile = String(env.NODE_ENV || 'development').toLowerCase();
  const override = {
    appName: env.APP_NAME,
    version: env.APP_VERSION,
    host: env.HOST,
    port: env.PORT ? Number(env.PORT) : undefined,
    requestTimeoutMs: env.REQUEST_TIMEOUT_MS ? Number(env.REQUEST_TIMEOUT_MS) : undefined,
    logLevel: env.LOG_LEVEL
  };

  const merged = deepMerge(defaultConfig, configProfiles[profile] || {});
  const configured = deepMerge(merged, Object.fromEntries(Object.entries(override).filter(([, value]) => value !== undefined && value !== '')));

  return {
    ...configured,
    profile,
    features: {
      ...defaultConfig.features,
      ...(configured.features || {})
    }
  };
}

export function describeConfig(config) {
  return {
    profile: config.profile,
    appName: config.appName,
    version: config.version,
    host: config.host,
    port: config.port,
    logLevel: config.logLevel,
    requestTimeoutMs: config.requestTimeoutMs,
    features: Object.entries(config.features || {}).map(([name, enabled]) => ({
      name,
      enabled: Boolean(enabled)
    }))
  };
}

export function createRuntimeConfig(env = process.env) {
  const config = loadConfig(env);
  return {
    ...config,
    endpoint: `http://${config.host}:${config.port}`,
    startedAt: new Date().toISOString()
  };
}
