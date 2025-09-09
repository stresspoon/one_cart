import { SEED_ITEMS, DEFAULT_SETTINGS } from '../fixtures/seed.js';

const KEYS = {
  items: 'cart.items',
  settings: 'cart.settings',
};

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return v === undefined ? null : v;
  } catch {
    return null;
  }
}

export const store = {
  ensureSeed() {
    const rawItems = localStorage.getItem(KEYS.items);
    const rawSettings = localStorage.getItem(KEYS.settings);
    const parsedItems = rawItems ? safeParse(rawItems) : null;
    const parsedSettings = rawSettings ? safeParse(rawSettings) : null;

    if (!parsedItems || !Array.isArray(parsedItems)) {
      localStorage.setItem(KEYS.items, JSON.stringify(SEED_ITEMS));
    }
    if (!parsedSettings || typeof parsedSettings !== 'object') {
      localStorage.setItem(KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
    }
  },

  getItems() {
    const raw = localStorage.getItem(KEYS.items);
    const parsed = raw ? safeParse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  },

  setItems(items) {
    localStorage.setItem(KEYS.items, JSON.stringify(items));
  },

  getSettings() {
    const raw = localStorage.getItem(KEYS.settings);
    const parsed = raw ? safeParse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : { ...DEFAULT_SETTINGS };
  },

  setSettings(settings) {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  },
};

