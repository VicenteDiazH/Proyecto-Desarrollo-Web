import { Router } from "express";
import {
  renderCart,
  addCart,
  removeCart,
  comprar,
  createReceipt,
  renderRecibos,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/cart", comprar);

router.get("/cart", isAuthenticated, renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", isAuthenticated, addCart);

router.post("/removeCart/:id", isAuthenticated, removeCart);

router.post("/cart", createReceipt);

router.get("/recibos", isAuthenticated, renderRecibos);

export default router;