import { Router } from 'express';
import { Product } from '../models/product.model.js';

const router = Router();

/**
 * GET /api/products
 * Query params:
 * - limit (default 10)
 * - page (default 1)
 * - query (opcional): admite {category: X} o {status: true/false}
 *   Ej: ?query=category:Electrónica  |  ?query=status:true
 * - sort (opcional): asc | desc (por price)
 *
 * Respuesta con el formato exigido.
 */
router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    // Construir filtro desde query
    const filter = {};
    if (query) {
      // Formatos aceptados: "category:xxx" o "status:true/false"
      const [key, rawVal] = query.split(':');
      if (key && rawVal !== undefined) {
        if (key === 'status') {
          filter.status = rawVal === 'true';
        } else if (key === 'category') {
          filter.category = rawVal;
        } else {
          // fallback: búsqueda general por title/description
          filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ];
        }
      } else {
        // si viene un string libre, usar búsqueda general
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
    }

    // Ordenamiento
    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: Object.keys(sortOption).length ? sortOption : undefined,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    // Links prev/next
    const { hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = result;

    const baseURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const urlParams = new URLSearchParams(req.query);

    const buildLink = (targetPage) => {
      const params = new URLSearchParams(urlParams);
      params.set('page', targetPage);
      return `${baseURL}?${params.toString()}`;
    };

    const responsePayload = {
      status: 'success',
      payload: result.docs,
      totalPages,
      prevPage,
      nextPage,
      page: result.page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(prevPage) : null,
      nextLink: hasNextPage ? buildLink(nextPage) : null
    };

    res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

/* === SEED RÁPIDO (para cargar datos de prueba). === */
router.post('/seed', async (req, res) => {
  try {
    const i = Date.now(); // evita conflicto con code único
    const payload = await Product.create([
      { title:'Mouse Óptico', description:'1200 DPI', code:`M-${i}`, price:5000,  stock:20, category:'Periféricos', status:true },
      { title:'Teclado Mecánico', description:'Switch Blue', code:`T-${i}`, price:15000, stock:15, category:'Periféricos', status:true },
      { title:'Monitor 24"', description:'FHD 75Hz',      code:`MO-${i}`, price:120000,stock:5,  category:'Pantallas',  status:true }
    ]);
    res.json({ status:'success', payload });
  } catch (e) {
    res.status(500).json({ status:'error', error:e.message });
  }
});

export default router;