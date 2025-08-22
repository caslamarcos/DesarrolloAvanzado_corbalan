import { Router } from "express";
import { listCarts, createCart, getCart, addToCart, removeFromCart } from "../controllers/carts.controller.js";

const router = Router();

router.get("/", listCarts);                      // GET  /api/carts
router.get("/:cid", getCart);                    // GET  /api/carts/1
router.post("/", createCart);                    // POST /api/carts
router.post("/:cid/product/:pid", addToCart);    // POST /api/carts/1/product/2  {quantity}
router.delete("/:cid/product/:pid", removeFromCart);

export default router;
