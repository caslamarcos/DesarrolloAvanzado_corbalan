import express from 'express';
import { connectDB } from './db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { hbsHelpers } from './views/helpers.js'; // 👈 Importamos los helpers

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// 🧩 Handlebars con helpers personalizados
app.engine('handlebars', engine({ helpers: hbsHelpers }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 🚀 Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 🌐 Rutas de vistas
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
  .catch(err => console.error('❌ DB error', err));