import { Router } from "express";
import { renderCart,addCart,removeCart,comprar} from "../controllers/cart.controller.js";

const router = Router();

router.post("/cart", comprar);

router.get("/cart", renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", addCart);

router.post("/removeCart/:id", removeCart);



export default router;
