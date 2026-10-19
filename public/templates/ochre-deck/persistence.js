// Store edits relative to the immutable embedded project. Media stays in the HTML.
const createDeckPersistence = (() => {
  'use strict';
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const imul = Math.imul;
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const LIMIT = 10000;
  const define = (target, key, value) => Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
  function clone(value, depth = 0) {
    if (depth > 128) throw Error('Persistence value is too deeply nested');
    if (Array.isArray(value)) return value.map(item => clone(item, depth + 1));
    if (object(value)) {
      const result = {};
      for (const key of Object.keys(value)) define(result, key, clone(value[key], depth + 1));
      return result;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return value;
    throw Error('Persistence requires JSON values');
  }
  function equal(a, b) {
    if (a === b) return true;
    if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((item, i) => equal(item, b[i]));
    if (!object(a) || !object(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(key => own(b, key) && equal(a[key], b[key]));
  }
  function fields(value, excluded) {
    const result = {};
    for (const key of Object.keys(value)) if (key !== excluded) define(result, key, value[key]);
    return result;
  }
  function normalize(project) {
    if (!object(project) || !Array.isArray(project.slides) || !project.slides.length || project.slides.length > 100) throw Error('Invalid presentation');
    const result = { project: fields(project, 'slides'), order: [], slides: new Map(), nodes: new Map() };
    function node(value, depth = 0) {
      if (depth > 80 || !object(value) || typeof value.id !== 'string' || !value.id || result.nodes.has(value.id) || result.nodes.size >= LIMIT) throw Error('Invalid content tree');
      const record = fields(value, 'children');
      result.nodes.set(value.id, record);
      if (own(value, 'children')) {
        if (!Array.isArray(value.children)) throw Error('Invalid content children');
        record.children = value.children.map(child => node(child, depth + 1));
      }
      return value.id;
    }
    for (const slide of project.slides) {
      if (!object(slide) || typeof slide.id !== 'string' || !slide.id || result.slides.has(slide.id)) throw Error('Invalid slide identity');
      const record = fields(slide, 'root');
      record.root = node(slide.root);
      result.order.push(slide.id);
      result.slides.set(slide.id, record);
    }
    return result;
  }
  function fingerprint(text) {
    let a = 2166136261, b = 0x9e3779b9;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      a = imul(a ^ c, 16777619);
      b = imul(b ^ c, 0x85ebca6b);
      b = b << 13 | b >>> 19;
    }
    return text.length.toString(36) + ':' + (a >>> 0).toString(36) + ':' + (b >>> 0).toString(36);
  }
  return function create(base, options = {}) {
    const baseline = normalize(base);
    const baseText = options.baseJSON || JSON.stringify(base);
    const stamp = fingerprint(baseText);
    const strings = new Map();
    function index(value, path = [], depth = 0) {
      if (depth > 128) throw Error('Persistence base is too deeply nested');
      if (typeof value === 'string') {
        if (value.length >= 1024 && !strings.has(value)) strings.set(value, path);
      } else if (Array.isArray(value)) value.forEach((item, i) => index(item, [...path, i], depth + 1));
      else if (object(value)) for (const key of Object.keys(value)) index(value[key], [...path, key], depth + 1);
    }
    index(base);
    function encode(value, depth = 0) {
      if (depth > 128) throw Error('Persistence value is too deeply nested');
      if (typeof value === 'string' && strings.has(value)) return ['r', strings.get(value)];
      if (Array.isArray(value)) return ['a', value.map(item => encode(item, depth + 1))];
      if (object(value)) return ['o', Object.keys(value).sort().map(key => [key, encode(value[key], depth + 1)])];
      return clone(value);
    }
    function decode(value, depth = 0) {
      if (depth > 128) throw Error('Persistence value is too deeply nested');
      if (!Array.isArray(value)) {
        if (object(value)) throw Error('Invalid persistence value');
        return clone(value);
      }
      if (value.length !== 2 || !Array.isArray(value[1])) throw Error('Invalid persistence encoding');
      const [type, payload] = value;
      if (type === 'r') {
        let result = base;
        if (payload.length > 128) throw Error('Invalid base reference');
        for (const key of payload) {
          if ((typeof key !== 'string' && (!Number.isInteger(key) || key < 0)) || result === null || typeof result !== 'object' || !own(result, key)) throw Error('Missing base reference');
          result = result[key];
        }
        if (typeof result !== 'string' || result.length < 1024) throw Error('Invalid base reference');
        return result;
      }
      if (type === 'a') return payload.map(item => decode(item, depth + 1));
      if (type !== 'o') throw Error('Unknown persistence encoding');
      const result = {};
      for (const pair of payload) {
        if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || own(result, pair[0])) throw Error('Invalid persisted object');
        define(result, pair[0], decode(pair[1], depth + 1));
      }
      return result;
    }
    function changes(before, after) {
      const set = [], remove = [];
      for (const key of Object.keys(after).sort()) if (!own(before, key) || !equal(before[key], after[key])) set.push([key, encode(after[key])]);
      for (const key of Object.keys(before).sort()) if (!own(after, key)) remove.push(key);
      return set.length || remove.length ? { s: set, d: remove } : undefined;
    }
    function mapChanges(before, after) {
      const added = [], changed = [], removed = [];
      for (const id of [...after.keys()].sort()) {
        if (!before.has(id)) added.push([id, encode(after.get(id))]);
        else {
          const patch = changes(before.get(id), after.get(id));
          if (patch) changed.push([id, patch]);
        }
      }
      for (const id of [...before.keys()].sort()) if (!after.has(id)) removed.push(id);
      return added.length || changed.length || removed.length ? { a: added, c: changed, d: removed } : undefined;
    }
    function snapshot(state) {
      const next = normalize(state), result = { v: 1, b: stamp };
      const project = changes(baseline.project, next.project);
      if (project) result.p = project;
      if (!equal(baseline.order, next.order)) result.o = next.order;
      const slides = mapChanges(baseline.slides, next.slides), nodes = mapChanges(baseline.nodes, next.nodes);
      if (slides) result.s = slides;
      if (nodes) result.n = nodes;
      return result;
    }
    function patch(record, delta) {
      if (!object(delta) || !Array.isArray(delta.s) || !Array.isArray(delta.d) || delta.s.length + delta.d.length > LIMIT) throw Error('Invalid persistence patch');
      const result = clone(record), keys = new Set();
      for (const key of delta.d) {
        if (typeof key !== 'string' || keys.has(key) || !own(record, key)) throw Error('Invalid removed field');
        keys.add(key);
        delete result[key];
      }
      for (const pair of delta.s) {
        if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || keys.has(pair[0])) throw Error('Invalid changed field');
        keys.add(pair[0]);
        define(result, pair[0], decode(pair[1]));
      }
      return result;
    }
    function patchMap(original, delta) {
      const result = new Map(original);
      if (delta === undefined) return result;
      if (!object(delta) || !['a', 'c', 'd'].every(key => Array.isArray(delta[key])) || delta.a.length + delta.c.length + delta.d.length > LIMIT) throw Error('Invalid persistence records');
      const ids = new Set();
      for (const id of delta.d) {
        if (typeof id !== 'string' || ids.has(id) || !original.has(id)) throw Error('Invalid removed identity');
        ids.add(id); result.delete(id);
      }
      for (const [kind, entries] of [['c', delta.c], ['a', delta.a]]) for (const pair of entries) {
        if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || !pair[0] || ids.has(pair[0]) || original.has(pair[0]) !== (kind === 'c')) throw Error('Invalid changed identity');
        const record = kind === 'c' ? patch(original.get(pair[0]), pair[1]) : decode(pair[1]);
        if (!object(record) || record.id !== pair[0]) throw Error('Mismatched persistence identity');
        ids.add(pair[0]); result.set(pair[0], record);
      }
      if (result.size > LIMIT) throw Error('Too many persistence records');
      return result;
    }
    function restore(delta) {
      if (!object(delta) || delta.v !== 1 || delta.b !== stamp) throw Error('Persistence base does not match');
      const project = delta.p ? patch(baseline.project, delta.p) : clone(baseline.project);
      const slides = patchMap(baseline.slides, delta.s), nodes = patchMap(baseline.nodes, delta.n);
      const order = delta.o === undefined ? baseline.order : delta.o;
      if (!Array.isArray(order) || !order.length || order.length > 100 || order.length !== slides.size || new Set(order).size !== order.length) throw Error('Invalid slide order');
      const visited = new Set();
      function node(id, depth = 0) {
        if (typeof id !== 'string' || depth > 80 || visited.has(id) || !nodes.has(id)) throw Error('Invalid restored content tree');
        visited.add(id);
        const record = nodes.get(id), value = fields(clone(record), 'children');
        if (own(record, 'children')) {
          if (!Array.isArray(record.children)) throw Error('Invalid restored children');
          value.children = record.children.map(child => node(child, depth + 1));
        }
        return value;
      }
      project.slides = order.map(id => {
        if (typeof id !== 'string' || !slides.has(id)) throw Error('Missing restored slide');
        const record = slides.get(id), value = fields(clone(record), 'root');
        value.root = node(record.root);
        return value;
      });
      if (visited.size !== nodes.size) throw Error('Unreachable restored content');
      return project;
    }
    function encodeState(state) { return JSON.stringify(snapshot(state)); }
    function decodeState(text) { return restore(typeof text === 'string' ? JSON.parse(text) : text); }
    function storageOf(settings) { return settings.getStorage ? settings.getStorage() : localStorage; }
    function parse(text, settings) {
      if (!text) return { status: 'missing' };
      const packet = JSON.parse(text);
      let state, editorConfig;
      if (packet?.kind === 'editable-deck-delta' && packet.version === 1) {
        if (packet.delta?.b !== stamp) return { status: 'stale' };
        state = restore(packet.delta);
        if (packet.editor !== undefined) editorConfig = decode(packet.editor);
        if (editorConfig !== undefined && !object(editorConfig)) throw Error('Invalid editor configuration');
      } else if (packet?.base === baseText && object(packet.state)) state = clone(packet.state);
      else return { status: 'stale' };
      if (settings.validate) settings.validate(state);
      if (editorConfig !== undefined && settings.validateEditor) settings.validateEditor(editorConfig);
      return { status: 'restored', state, editorConfig };
    }
    function failure(error) {
      const quota = error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error?.code === 22 || error?.code === 1014;
      return { status: quota ? 'storage-full' : error?.name === 'SecurityError' || error?.name === 'ReferenceError' || error?.name === 'UnavailableError' ? 'unavailable' : 'invalid', error };
    }
    function packetText(state, editorConfig) {
      const packet = { kind: 'editable-deck-delta', version: 1, delta: snapshot(state) };
      if (editorConfig !== undefined) packet.editor = encode(editorConfig);
      return JSON.stringify(packet);
    }
    function load(key, settings = {}) {
      if (settings.preview) return { status: 'preview' };
      try { return parse(storageOf(settings).getItem(key), settings); } catch (error) { return failure(error); }
    }
    function save(key, state, editorConfig, settings = {}) {
      if (settings.preview) return { status: 'preview' };
      try {
        const text = packetText(state, editorConfig);
        storageOf(settings).setItem(key, text);
        return { status: 'saved', bytes: text.length * 2, store: 'local' };
      } catch (error) { return failure(error); }
    }
    // IndexedDB holds uploaded media far beyond the few-megabyte localStorage quota.
    let database = null;
    function openDatabase(settings) {
      if (settings.indexedDB === false) return Promise.reject(Object.assign(Error('IndexedDB disabled'), { name: 'UnavailableError' }));
      if (!database) database = new Promise((resolve, reject) => {
        const factory = settings.indexedDB || globalThis.indexedDB;
        if (!factory) { reject(Object.assign(Error('IndexedDB unavailable'), { name: 'UnavailableError' })); return; }
        const request = factory.open('editable-deck', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('records');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || Object.assign(Error('IndexedDB failed'), { name: 'UnavailableError' }));
        request.onblocked = () => reject(Object.assign(Error('IndexedDB blocked'), { name: 'UnavailableError' }));
      }).catch(error => { database = null; throw error; });
      return database;
    }
    function transaction(settings, mode, run) {
      return openDatabase(settings).then(db => new Promise((resolve, reject) => {
        const tx = db.transaction('records', mode), store = tx.objectStore('records');
        let result;
        const request = run(store);
        request.onsuccess = () => { result = request.result; };
        tx.oncomplete = () => resolve(result);
        tx.onerror = tx.onabort = () => reject(tx.error || request.error || Error('IndexedDB transaction failed'));
      }));
    }
    async function loadAsync(key, settings = {}) {
      if (settings.preview) return { status: 'preview' };
      let text;
      try { text = await transaction(settings, 'readonly', store => store.get(key)); }
      catch { return load(key, settings); }
      if (text === undefined) return load(key, settings);
      try { return { ...parse(text, settings), store: 'indexeddb' }; } catch (error) { return failure(error); }
    }
    async function saveAsync(key, state, editorConfig, settings = {}) {
      if (settings.preview) return { status: 'preview' };
      let text;
      try { text = packetText(state, editorConfig); } catch (error) { return failure(error); }
      try {
        await transaction(settings, 'readwrite', store => store.put(text, key));
        try { storageOf(settings).removeItem(key); } catch {}
        return { status: 'saved', bytes: text.length * 2, store: 'indexeddb' };
      } catch (error) {
        if (failure(error).status === 'storage-full') return failure(error);
        try { storageOf(settings).setItem(key, text); return { status: 'saved', bytes: text.length * 2, store: 'local' }; }
        catch (fallback) { return failure(fallback); }
      }
    }
    return Object.freeze({ encodeState, decodeState, makeSnapshot: encodeState, restoreSnapshot: decodeState, load, save, loadAsync, saveAsync, fingerprint: stamp });
  };
})();
