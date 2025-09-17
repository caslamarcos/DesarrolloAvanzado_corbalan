import app from "./app.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerSocketHandlers } from "./sockets.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer); // CORS por defecto ok en local

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`✅ desarrollo_backend + websockets en http://localhost:${PORT}`);
});