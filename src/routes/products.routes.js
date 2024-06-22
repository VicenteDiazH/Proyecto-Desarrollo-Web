import { Router } from "express";
import { renderProductForm, createNewProduct, renderProducts, renderEditForm, editProduct, deleteProduct, renderAlbumPage } from "../controllers/products.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.get('/addProduct', [isAuthenticated, isAdmin], renderProductForm);

router.post('/addProduct', [isAuthenticated, isAdmin], createNewProduct);

router.get('/', renderProducts);

router.get('/edit/:id', [isAuthenticated, isAdmin], renderEditForm);

router.put('/edit/:id', [isAuthenticated, isAdmin], editProduct);

router.get('/albumPages/:id', renderAlbumPage);

router.get('/delete/:id', [isAuthenticated, isAdmin], deleteProduct);

export default router;