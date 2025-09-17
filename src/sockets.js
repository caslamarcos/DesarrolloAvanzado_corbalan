import * as productService from "./services/products.service.js";

export function registerSocketHandlers(io) {
  io.on("connection", async (socket) => {
    // Enviar lista inicial
    const initial = await productService.getAll();
    socket.emit("products:list", initial);

    // Crear producto desde WS
    socket.on("product:create", async (payload, cb) => {
      try {
        const { title, price, stock } = payload || {};
        if (!title || typeof price !== "number" || !Number.isInteger(stock))
          throw new Error("Datos inválidos (title, price, stock).");

        await productService.create({ title: title.trim(), price, stock });
        const updated = await productService.getAll();
        io.emit("products:list", updated); // broadcast
        cb && cb({ ok: true });
      } catch (err) {
        cb && cb({ ok: false, error: err.message });
      }
    });

    // Eliminar producto desde WS
    socket.on("product:delete", async (id, cb) => {
      try {
        const ok = await productService.remove(Number(id));
        if (!ok) throw new Error("Producto no encontrado.");
        const updated = await productService.getAll();
        io.emit("products:list", updated);
        cb && cb({ ok: true });
      } catch (err) {
        cb && cb({ ok: false, error: err.message });
      }
    });
  });
}