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
    let qty = Number(req.body?.quantity ?? 1);
    if (!Number.isInteger(qty) || qty <= 0) qty = 1;

    const prod = await products.getById(pid);
    if (!prod) return res.status(404).json({ status: "error", error: "Producto inexistente" });

    if (prod.stock < qty) {
      return res.status(400).json({ status: "error", error: `Stock insuficiente (disponible: ${prod.stock})` });
    }

    const updatedCart = await carts.addProduct(cid, pid, qty);
    if (!updatedCart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    // Descontar stock del producto
    await products.update(pid, { stock: prod.stock - qty });

    res.json({ status: "success", payload: updatedCart });
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
