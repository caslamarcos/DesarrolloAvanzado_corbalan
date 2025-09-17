import * as products from "../services/products.service.js";

export const list = async (_req, res, next) => {
  try {
    const all = await products.getAll();
    res.json({ status: "success", payload: all });
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
    const required = ["title", "price", "stock"];
    for (const k of required) {
      if (req.body[k] == null) return res.status(400).json({ status: "error", error: `Falta campo: ${k}` });
    }
    const item = await products.create(req.body);
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