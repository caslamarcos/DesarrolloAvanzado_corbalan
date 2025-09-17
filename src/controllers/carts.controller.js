import * as carts from "../services/carts.service.js";
import * as products from "../services/products.service.js";

export const listCarts = async (_req, res, next) => {
  try {
    const all = await carts.getAll();
    res.json({ status: "success", payload: all });
  } catch (e) { next(e); }
};

export const createCart = async (_req, res, next) => {
  try {
    const cart = await carts.create();
    res.status(201).json({ status: "success", payload: cart });
  } catch (e) { next(e); }
};

export const getCart = async (req, res, next) => {
  try {
    const cid = Number(req.params.cid);
    const cart = await carts.getById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (e) { next(e); }
};

export const addToCart = async (req, res, next) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const qty = Number(req.body?.quantity ?? 1);

    const exists = await products.getById(pid);
    if (!exists) return res.status(404).json({ status: "error", error: "Producto inexistente" });

    const updated = await carts.addProduct(cid, pid, qty);
    if (!updated) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    res.json({ status: "success", payload: updated });
  } catch (e) { next(e); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    const ok = await carts.removeProduct(cid, pid);
    if (ok === null) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    if (ok === false) return res.status(404).json({ status: "error", error: "Producto no estaba en el carrito" });

    res.status(204).send();
  } catch (e) { next(e); }
};