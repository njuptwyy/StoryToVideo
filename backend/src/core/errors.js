export class AppError extends Error {
  constructor(code, message, details = null, status = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export class NotFoundError extends AppError {
  constructor(resource, query = {}) {
    super(
      'NOT_FOUND',
      `${resource} not found`,
      { resource, query },
      404
    );
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message, details = null) {
    super('CONFLICT', message, details, 409);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super('VALIDATION_ERROR', message, details, 422);
    this.name = 'ValidationError';
  }
}

export class PermissionError extends AppError {
  constructor(message = 'Permission denied', details = null) {
    super('PERMISSION_DENIED', message, details, 403);
    this.name = 'PermissionError';
  }
}

export function normalizeError(error) {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      'INTERNAL_ERROR',
      error.message || 'Internal server error',
      { stack: error.stack },
      500
    );
  }

  return new AppError('INTERNAL_ERROR', 'Unknown error', { error }, 500);
}

export function errorToJSON(error) {
  const normalized = normalizeError(error);
  return {
    code: normalized.code,
    message: normalized.message,
    details: normalized.details,
    status: normalized.status
  };
}

export function assert(condition, message, details = null) {
  if (!condition) {
    throw new ValidationError(message, details);
  }
}

export function ensureString(value, fieldName, options = {}) {
  const { minLength = 0, maxLength = Infinity, allowEmpty = false } = options;
  assert(typeof value === 'string', `${fieldName} must be a string`, { fieldName, value });
  if (!allowEmpty) {
    assert(value.trim().length > 0, `${fieldName} cannot be empty`, { fieldName, value });
  }
  assert(value.length >= minLength, `${fieldName} must be at least ${minLength} characters`, { fieldName, value });
  assert(value.length <= maxLength, `${fieldName} must be at most ${maxLength} characters`, { fieldName, value });
  return value;
}

export function ensureArray(value, fieldName, options = {}) {
  const { minLength = 0, maxLength = Infinity } = options;
  assert(Array.isArray(value), `${fieldName} must be an array`, { fieldName, value });
  assert(value.length >= minLength, `${fieldName} must have at least ${minLength} items`, { fieldName, value });
  assert(value.length <= maxLength, `${fieldName} must have at most ${maxLength} items`, { fieldName, value });
  return value;
}

export function ensureObject(value, fieldName) {
  assert(Boolean(value) && typeof value === 'object' && !Array.isArray(value), `${fieldName} must be an object`, {
    fieldName,
    value
  });
  return value;
}
