import { Router } from "express";
import { renderProductForm, createNewProduct,renderProducts,renderEditForm,editProduct,deleteProduct,renderAlbumPage} from "../controllers/products.controller.js";
const router =Router();

router.get('/addProduct',renderProductForm);

router.post('/addProduct',createNewProduct);

router.get('/',renderProducts);

router.get('/edit/:id',renderEditForm);

router.put('/edit/:id',editProduct);

router.get('/albumPages/:id',renderAlbumPage);

router.get('/delete/:id',deleteProduct);

export default router;