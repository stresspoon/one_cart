import { DEFAULT_SETTINGS, SEED_ITEMS } from "../fixtures/seed.js";

const KEYS = {
  ITEMS: "cart.items",
  SETTINGS: "cart.settings",
};

function safeParse(json) {
  if (json === undefined || json === null) return undefined;
  try {
    const val = JSON.parse(json);
    if (val === undefined) return undefined;
    return val;
  } catch {
    return undefined;
  }
}

export function ensureSeed() {
  const rawItems = localStorage.getItem(KEYS.ITEMS);
  const rawSettings = localStorage.getItem(KEYS.SETTINGS);

  const items = safeParse(rawItems);
  const settings = safeParse(rawSettings);

  if (!Array.isArray(items)) {
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
  }
  if (!settings || typeof settings !== "object") {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}

export function getItems() {
  const parsed = safeParse(localStorage.getItem(KEYS.ITEMS));
  return Array.isArray(parsed) ? parsed : [...SEED_ITEMS];
}

export function setItems(items) {
  localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
}

export function getSettings() {
  const parsed = safeParse(localStorage.getItem(KEYS.SETTINGS));
  return parsed || { ...DEFAULT_SETTINGS };
}

export function setSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

