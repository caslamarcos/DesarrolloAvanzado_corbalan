import { dataPath } from "../utils/paths.js";
import { readJSON, writeJSON } from "../utils/fsJson.js";

const PRODUCTS = dataPath("products.json");

export async function getAll() {
  return await readJSON(PRODUCTS, []);
}

export async function getById(id) {
  const items = await getAll();
  return items.find(p => p.id === id);
}

export async function create(data) {
  const items = await getAll();
  const id = items.length ? Math.max(...items.map(p => p.id)) + 1 : 1;
  const product = { id, ...data };
  items.push(product);
  await writeJSON(PRODUCTS, items);
  return product;
}

export async function update(id, partial) {
  const items = await getAll();
  const idx = items.findIndex(p => p.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...partial };
  await writeJSON(PRODUCTS, items);
  return items[idx];
}

export async function remove(id) {
  const items = await getAll();
  const newItems = items.filter(p => p.id !== id);
  if (newItems.length === items.length) return false;
  await writeJSON(PRODUCTS, newItems);
  return true;
}
