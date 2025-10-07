import { Router } from 'express';
import { Product } from '../models/product.model.js';
import { Cart } from '../models/cart.model.js';

const router = Router();

/**
 * /products → lista con paginación (misma lógica que API pero render)
 * Query: limit, page, sort, query
 */
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    const [key, rawVal] = query.split(':');
    if (key && rawVal !== undefined) {
      if (key === 'status') filter.status = rawVal === 'true';
      else if (key === 'category') filter.category = rawVal;
      else {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
    } else {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
  }

  const sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  if (sort === 'desc') sortOption.price = -1;

  const result = await Product.paginate(filter, {
    limit: Number(limit) || 10,
    page: Number(page) || 1,
    sort: Object.keys(sortOption).length ? sortOption : undefined,
    lean: true
  });

  const urlParams = new URLSearchParams(req.query);
  const buildLink = (p) => {
    const params = new URLSearchParams(urlParams);
    params.set('page', p);
    return `/products?${params.toString()}`;
  };

  res.render('products', {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
    nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    queryCurrent: query || '',
    sortCurrent: sort || '',
    limitCurrent: limit
  });
});

/** Vista detalle (opcional sugerida) */
router.get('/products/:pid', async (req, res) => {
  const prod = await Product.findById(req.params.pid).lean();
  if (!prod) return res.status(404).send('Producto no encontrado');
  res.render('productDetail', { product: prod });
});

/** Vista carrito /carts/:cid */
router.get('/carts/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  if (!cart) return res.status(404).send('Carrito no encontrado');
  const items = cart.products.map(p => ({
    _id: p.product._id,
    title: p.product.title,
    price: p.product.price,
    quantity: p.quantity,
    subtotal: p.quantity * p.product.price
  }));
  const total = items.reduce((acc, i) => acc + i.subtotal, 0);
  res.render('cart', { cartId: cart._id, items, total });
});

export default router;