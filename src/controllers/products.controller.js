import * as products from "../services/products.service.js";

export const list = async (req, res, next) => {
  try {
    const all = await products.getAll();
    const limit = Number(req.query.limit);
    const data = Number.isInteger(limit) && limit > 0 ? all.slice(0, limit) : all;
    res.json({ status: "success", payload: data });
  } catch (e) { next(e); }
};

export const get = async (req, res, next) => {
  try {
    const id = Number(req.params.pid);
    const item = await products.getById(id);
    if (!item) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: item });
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const { title, price, stock } = req.body;

    if (title == null || price == null || stock == null) {
      return res.status(400).json({ status: "error", error: "Faltan campos: title, price, stock" });
    }
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ status: "error", error: "title debe ser string no vacío" });
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ status: "error", error: "price debe ser número > 0" });
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ status: "error", error: "stock debe ser entero >= 0" });
    }

    const item = await products.create({ title: title.trim(), price, stock });
    res.status(201).json({ status: "success", payload: item });
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.pid);
    const updated = await products.update(id, req.body);
    if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.pid);
    const ok = await products.remove(id);
    if (!ok) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.status(204).send();
  } catch (e) { next(e); }
};
