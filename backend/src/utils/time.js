const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function nowIso() {
  return new Date().toISOString();
}

export function toDate(value) {
  if (value instanceof Date) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function toIso(value) {
  const date = toDate(value);
  return date ? date.toISOString() : null;
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) {
    return '';
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(value) {
  const date = toDate(value);
  if (!date) {
    return '';
  }
  return date.toISOString().slice(0, 10);
}

export function startOfDay(value = new Date()) {
  const date = toDate(value) || new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(value = new Date()) {
  const date = toDate(value) || new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

export function daysBetween(left, right) {
  const a = startOfDay(left).getTime();
  const b = startOfDay(right).getTime();
  return Math.round((b - a) / 86400000);
}

export function addDays(value, amount) {
  const date = toDate(value) || new Date();
  date.setDate(date.getDate() + amount);
  return date;
}

export function isSameDay(left, right) {
  return formatDate(left) === formatDate(right);
}

export function isIsoDate(value) {
  return typeof value === 'string' && ISO_DATE.test(value);
}

export function toRelativeDayLabel(offset) {
  if (offset === 0) {
    return '今天';
  }
  if (offset === -1) {
    return '昨天';
  }
  if (offset === 1) {
    return '明天';
  }
  return `${offset}天`;
}

export function clampDate(value, minValue, maxValue) {
  const current = toDate(value) || new Date();
  const minDate = toDate(minValue);
  const maxDate = toDate(maxValue);
  if (minDate && current < minDate) {
    return minDate;
  }
  if (maxDate && current > maxDate) {
    return maxDate;
  }
  return current;
}

export function buildTimelineWindow(days = 7) {
  const end = endOfDay();
  const start = startOfDay(addDays(end, -(days - 1)));
  return { start, end };
}

export function describeWindow(window) {
  const start = formatDateTime(window.start);
  const end = formatDateTime(window.end);
  return `${start} ~ ${end}`;
}
