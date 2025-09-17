import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Static (para /js del cliente)
app.use(express.static(path.join(__dirname, "public")));

// Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "desarrollo_backend", time: new Date().toISOString() });
});

// Routers
app.use("/", viewsRouter);                 // vistas: / y /realtimeproducts
app.use("/api/products", productsRouter);  // API REST
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