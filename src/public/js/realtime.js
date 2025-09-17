const socket = io();

// Renderizar lista
function renderList(products) {
  const ul = document.getElementById("productList");
  if (!ul) return;
  if (!products?.length) {
    ul.innerHTML = "<li>No hay productos aún.</li>";
    return;
  }
  ul.innerHTML = products.map(p => `
    <li class="item" data-id="${p.id}">
      <span><strong>#${p.id}</strong> — ${p.title} — $${p.price} — stock: ${p.stock}</span>
      <button class="delBtn danger" data-id="${p.id}">Eliminar</button>
    </li>
  `).join("");
}

// Escucha del servidor
socket.on("products:list", renderList);

// Crear producto (via WS)
const form = document.getElementById("createForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const price = Number(fd.get("price"));
    const stock = parseInt(fd.get("stock"), 10);

    const msg = document.getElementById("createMsg");
    msg.textContent = "Creando...";

    socket.emit("product:create", { title, price, stock }, (resp) => {
      if (resp?.ok) {
        msg.textContent = "✅ Creado";
        form.reset();
      } else {
        msg.textContent = `❌ ${resp?.error || "Error"}`;
      }
      setTimeout(() => (msg.textContent = ""), 1500);
    });
  });
}

// Eliminar producto (delegación)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".delBtn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  btn.disabled = true;
  btn.textContent = "Eliminando...";
  socket.emit("product:delete", id, (resp) => {
    if (!resp?.ok) {
      alert(resp?.error || "Error eliminando");
    }
  });
});