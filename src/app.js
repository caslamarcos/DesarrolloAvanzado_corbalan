import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "desarrollo_backend", time: new Date().toISOString() });
});

// Routers (IMPORTANTE: antes del 404)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ status: "error", error: "Ruta no encontrada" });
});

// Errores
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: "error", error: "Internal Server Error" });
});

export default app;
