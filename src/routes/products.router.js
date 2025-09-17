import { Router } from "express";
import { list, get, create, update, remove } from "../controllers/products.controller.js";

const router = Router();
router.get("/", list);
router.get("/:pid", get);
router.post("/", create);
router.put("/:pid", update);
router.delete("/:pid", remove);
export default router;