import { Router } from "express";
import {
  renderCart,
  addCart,
  removeCart,
  comprar,
  renderRecibos,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/cart", isAuthenticated, comprar);

router.get("/cart", isAuthenticated, renderCart);

router.post("/albumPages/:id", isAuthenticated, addCart);

router.post("/addCart/:id", isAuthenticated, addCart);

router.post("/removeCart/:id", isAuthenticated, removeCart);

router.get("/recibos", isAuthenticated, renderRecibos);

export default router;