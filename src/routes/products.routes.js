import { Router } from "express";
import { renderProductForm, createNewProduct, renderProducts, renderEditForm, editProduct, deleteProduct, renderAlbumPage } from "../controllers/products.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.get('/addProduct', isAuthenticated, renderProductForm);

router.post('/addProduct', isAuthenticated, createNewProduct);

router.get('/', renderProducts);

router.get('/edit/:id', isAuthenticated, renderEditForm);

router.put('/edit/:id', isAuthenticated, editProduct);

router.get('/albumPages/:id', renderAlbumPage);

router.get('/delete/:id', isAuthenticated, deleteProduct);

export default router;