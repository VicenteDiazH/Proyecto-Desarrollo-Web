import { Router } from "express";
import { renderCart,addCart,removeCart} from "../controllers/cart.controller.js";

const router = Router();

router.get("/cart", renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", addCart);

router.post("/removeCart/:id", removeCart);



export default router;
