import { SEED_ITEMS, DEFAULT_SETTINGS } from '../fixtures/seed.js';

const KEYS = {
  items: 'cart.items',
  settings: 'cart.settings',
};

// localStorage shim for non-browser (tests) environments
function createStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch (_) { /* ignore */ }
  const mem = new Map();
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => void mem.set(k, String(v)),
    removeItem: (k) => void mem.delete(k),
  };
}

const storage = createStorage();

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch (_) {
    return fallback;
  }
}

function ensureSeed() {
  // Items
  const rawItems = storage.getItem(KEYS.items);
  let items = safeParse(rawItems, undefined);
  if (!Array.isArray(items)) {
    items = SEED_ITEMS;
    storage.setItem(KEYS.items, JSON.stringify(items));
  }
  // Settings
  const rawSettings = storage.getItem(KEYS.settings);
  let settings = safeParse(rawSettings, undefined);
  if (!settings || typeof settings !== 'object') {
    settings = DEFAULT_SETTINGS;
    storage.setItem(KEYS.settings, JSON.stringify(settings));
  }
}

function getItems() {
  const raw = storage.getItem(KEYS.items);
  const items = safeParse(raw, []);
  return Array.isArray(items) ? items : [];
}

function setItems(items) {
  storage.setItem(KEYS.items, JSON.stringify(items));
}

function getSettings() {
  const raw = storage.getItem(KEYS.settings);
  const s = safeParse(raw, DEFAULT_SETTINGS);
  return s || DEFAULT_SETTINGS;
}

function setSettings(s) {
  storage.setItem(KEYS.settings, JSON.stringify(s));
}

// Export mutable object to allow test-time spying
export const store = {
  ensureSeed,
  getItems,
  setItems,
  getSettings,
  setSettings,
};

