import { Router } from "express";
import * as products from "../services/products.service.js";

const router = Router();

// Vista estática (HTTP)
router.get("/", async (_req, res, next) => {
  try {
    const list = await products.getAll();
    res.render("home", { products: list });
  } catch (e) { next(e); }
});

// Vista en tiempo real (Socket.IO)
router.get("/realtimeproducts", async (_req, res, next) => {
  try {
    const list = await products.getAll();
    res.render("realTimeProducts", { products: list });
  } catch (e) { next(e); }
});

export default router;