import { dataPath } from "../utils/paths.js";
import { readJSON, writeJSON } from "../utils/fsJson.js";

const CARTS = dataPath("carts.json");

export async function getAll() {
  return await readJSON(CARTS, []);
}

export async function getById(id) {
  const carts = await getAll();
  return carts.find(c => c.id === id);
}

export async function create() {
  const carts = await getAll();
  const id = carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
  const cart = { id, products: [] };
  carts.push(cart);
  await writeJSON(CARTS, carts);
  return cart;
}

export async function addProduct(cid, pid, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity <= 0) quantity = 1;

  const carts = await getAll();
  const idx = carts.findIndex(c => c.id === cid);
  if (idx === -1) return null;

  const found = carts[idx].products.find(p => p.productId === pid);
  if (found) found.quantity += quantity;
  else carts[idx].products.push({ productId: pid, quantity });

  await writeJSON(CARTS, carts);
  return carts[idx];
}

export async function removeProduct(cid, pid) {
  const carts = await getAll();
  const idx = carts.findIndex(c => c.id === cid);
  if (idx === -1) return null;

  const before = carts[idx].products.length;
  carts[idx].products = carts[idx].products.filter(p => p.productId !== pid);
  if (carts[idx].products.length === before) return false;

  await writeJSON(CARTS, carts);
  return true;
}
