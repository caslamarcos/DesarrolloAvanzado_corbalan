import { Router } from 'express';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

const router = Router();

// (Si ya lo tenías en TP2, mantené tus endpoints de crear carrito y agregar producto)
// Crear carrito vacío
router.post('/', async (req, res) => {
  const cart = await Cart.create({ products: [] });
  res.status(201).json({ status: 'success', payload: cart });
});

// Agregar producto al carrito (mantener lógica previa)
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const prod = await Product.findById(pid);
  if (!prod) return res.status(404).json({ status: 'error', error: 'Product not found' });

  const item = cart.products.find(p => p.product.toString() === pid);
  if (item) item.quantity += Number(quantity);
  else cart.products.push({ product: pid, quantity: Number(quantity) });

  await cart.save();
  res.json({ status: 'success', payload: cart });
});

// GET carrito con populate (modificar /:cid según consigna)
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products.product').lean();
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  res.json({ status: 'success', payload: cart });
});

/**
 * DELETE /api/carts/:cid/products/:pid  → elimina del carrito el producto seleccionado
 */
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json({ status: 'success', message: 'Product removed', payload: cart });
});

/**
 * PUT /api/carts/:cid  → actualiza todos los productos del carrito con un arreglo de productos
 * body: { products: [ { product: <productId>, quantity: <n> }, ...] }
 */
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ status: 'error', error: 'products must be an array' });
  }
  // Validar que existan los products
  const ids = products.map(p => p.product);
  const count = await Product.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) {
    return res.status(400).json({ status: 'error', error: 'Some product ids are invalid' });
  }

  const cart = await Cart.findByIdAndUpdate(
    cid,
    { $set: { products } },
    { new: true }
  );
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  res.json({ status: 'success', payload: cart });
});

/**
 * PUT /api/carts/:cid/products/:pid → actualizar SOLO la cantidad del producto
 * body: { quantity: <n> }
 */
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < 1) {
    return res.status(400).json({ status: 'error', error: 'quantity must be >= 1' });
  }

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) return res.status(404).json({ status: 'error', error: 'Product not in cart' });

  item.quantity = q;
  await cart.save();

  res.json({ status: 'success', payload: cart });
});

/**
 * DELETE /api/carts/:cid → vaciar carrito
 */
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  cart.products = [];
  await cart.save();

  res.json({ status: 'success', message: 'Cart emptied', payload: cart });
});

export default router;