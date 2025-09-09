import { SEED_ITEMS, DEFAULT_SETTINGS } from '../fixtures/seed.js';

const KEY_ITEMS = 'cart.items';
const KEY_SETTINGS = 'cart.settings';

function read(key){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return undefined;
    return JSON.parse(raw);
  }catch(_){ return undefined; }
}

function write(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
  }catch(_){ /* ignore quota */ }
}

export function ensureSeed(){
  const items = read(KEY_ITEMS);
  const settings = read(KEY_SETTINGS);
  if(!Array.isArray(items)) write(KEY_ITEMS, SEED_ITEMS);
  if(!settings || !settings.colors) write(KEY_SETTINGS, DEFAULT_SETTINGS);
}

export function getItems(){
  const v = read(KEY_ITEMS);
  return Array.isArray(v) ? v : [];
}

export function setItems(items){
  write(KEY_ITEMS, items);
}

export function getSettings(){
  const s = read(KEY_SETTINGS);
  return s && s.colors ? s : { ...DEFAULT_SETTINGS };
}

export function setSettings(s){
  write(KEY_SETTINGS, s);
}

// For migrations: export a placeholder hook (no-op)
export function migrate(){ /* future schema migrations */ }

