import { createId } from '../utils/id.js';
import { nowIso } from '../utils/time.js';

export class MemoryStore {
  constructor(seed = {}) {
    this.collections = new Map();
    this.history = [];
    this.initialize(seed);
  }

  initialize(seed) {
    Object.entries(seed).forEach(([name, rows]) => {
      this.collections.set(name, Array.isArray(rows) ? [...rows] : []);
    });
  }

  ensureCollection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }
    return this.collections.get(name);
  }

  list(name, predicate = null) {
    const rows = [...this.ensureCollection(name)];
    if (typeof predicate === 'function') {
      return rows.filter(predicate);
    }
    return rows;
  }

  count(name, predicate = null) {
    return this.list(name, predicate).length;
  }

  findById(name, id) {
    return this.ensureCollection(name).find(item => item.id === id) || null;
  }

  insert(name, row) {
    const collection = this.ensureCollection(name);
    const record = {
      id: row.id || createId(name),
      createdAt: row.createdAt || nowIso(),
      updatedAt: row.updatedAt || nowIso(),
      ...row
    };
    collection.push(record);
    this.recordHistory('insert', name, record.id, record);
    return record;
  }

  insertMany(name, rows) {
    return rows.map(row => this.insert(name, row));
  }

  update(name, id, patch) {
    const collection = this.ensureCollection(name);
    const index = collection.findIndex(item => item.id === id);
    if (index < 0) {
      return null;
    }
    const current = collection[index];
    const updated = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: nowIso()
    };
    collection[index] = updated;
    this.recordHistory('update', name, id, patch);
    return updated;
  }

  upsert(name, row) {
    if (row?.id && this.findById(name, row.id)) {
      return this.update(name, row.id, row);
    }
    return this.insert(name, row);
  }

  remove(name, id) {
    const collection = this.ensureCollection(name);
    const index = collection.findIndex(item => item.id === id);
    if (index < 0) {
      return null;
    }
    const [removed] = collection.splice(index, 1);
    this.recordHistory('remove', name, id, removed);
    return removed;
  }

  replace(name, rows) {
    const normalized = Array.isArray(rows) ? rows.map(row => ({ ...row })) : [];
    this.collections.set(name, normalized);
    this.recordHistory('replace', name, '*', { size: normalized.length });
    return this.list(name);
  }

  clear(name) {
    this.collections.set(name, []);
    this.recordHistory('clear', name, '*', null);
  }

  snapshot() {
    const output = {};
    for (const [name, rows] of this.collections.entries()) {
      output[name] = rows.map(row => ({ ...row }));
    }
    return output;
  }

  cloneCollection(name) {
    return this.list(name).map(row => ({ ...row }));
  }

  recordHistory(action, collection, targetId, payload) {
    this.history.push({
      id: createId('history'),
      action,
      collection,
      targetId,
      payload,
      at: nowIso()
    });
  }

  getHistory(limit = 20) {
    return [...this.history].slice(-limit).reverse();
  }

  filter(name, evaluator) {
    return this.list(name).filter(evaluator);
  }

  map(name, mapper) {
    return this.list(name).map(mapper);
  }

  groupBy(name, selector) {
    return this.list(name).reduce((groups, row) => {
      const key = selector(row);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
      return groups;
    }, {});
  }

  sort(name, comparer) {
    return this.list(name).sort(comparer);
  }

  transaction(callback) {
    const before = this.snapshot();
    try {
      const result = callback(this);
      return { committed: true, result };
    } catch (error) {
      this.restore(before);
      return { committed: false, error };
    }
  }

  restore(snapshot) {
    this.collections = new Map();
    Object.entries(snapshot).forEach(([name, rows]) => {
      this.collections.set(name, rows.map(row => ({ ...row })));
    });
    this.recordHistory('restore', 'all', '*', { collections: Object.keys(snapshot).length });
  }

  has(name, id) {
    return Boolean(this.findById(name, id));
  }

  touch(name, id) {
    const current = this.findById(name, id);
    if (!current) {
      return null;
    }
    return this.update(name, id, { touchedAt: nowIso() });
  }

  getCollectionNames() {
    return [...this.collections.keys()];
  }
}
