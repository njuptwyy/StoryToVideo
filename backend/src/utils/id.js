import { randomBytes } from 'node:crypto';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

function encodeNumber(number) {
  if (number === 0) {
    return '0';
  }

  let current = Math.abs(number);
  let output = '';

  while (current > 0) {
    const index = current % ALPHABET.length;
    output = ALPHABET[index] + output;
    current = Math.floor(current / ALPHABET.length);
  }

  return output;
}

export function createId(prefix = 'id') {
  const timePart = encodeNumber(Date.now());
  const randomPart = randomBytes(4).toString('hex');
  return `${prefix}_${timePart}_${randomPart}`;
}

export function createSlug(source) {
  return String(source)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

export function createRevisionTag(label, index = 0) {
  const safeLabel = createSlug(label);
  return `${safeLabel}-r${index + 1}`;
}

export function isLikelyId(value) {
  return typeof value === 'string' && value.includes('_') && value.length >= 12;
}

export function shortId(value) {
  const text = String(value);
  if (text.length <= 10) {
    return text;
  }
  return `${text.slice(0, 6)}…${text.slice(-3)}`;
}

export function createSequenceId(prefix, index) {
  const n = Number.isFinite(index) ? index : 0;
  return `${prefix}-${String(n + 1).padStart(3, '0')}`;
}

export function stableHash(input) {
  const text = String(input);
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function buildCompositeId(parts) {
  if (!Array.isArray(parts) || parts.length === 0) {
    return createId('composite');
  }

  return parts
    .filter(Boolean)
    .map(part => createSlug(part))
    .join('__');
}

export function createReferenceCode(scope, name, index = 0) {
  return `${createSlug(scope)}:${createSlug(name)}:${String(index + 1).padStart(2, '0')}`;
}
