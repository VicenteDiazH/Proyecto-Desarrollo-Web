import { Router } from "express";
import { renderCart,addCart,removeCart,comprar, crearReceipt, renderReceipts} from "../controllers/cart.controller.js";


const router = Router();

router.post("/cart", comprar);

router.get("/cart", renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", addCart);

router.post("/removeCart/:id", removeCart);

router.post("/cart", crearReceipt);

router.get("/receipts", renderReceipts);

export default router;
