import app from "./app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ desarrollo_backend escuchando en http://localhost:${PORT}`);
});