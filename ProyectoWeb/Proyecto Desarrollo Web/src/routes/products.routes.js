import { Router } from "express";
import { renderProductForm, createNewProduct,renderProducts,renderEditForm,editProduct,deleteProduct} from "../controllers/products.controller.js";
const router =Router();

router.get('/addProduct',renderProductForm);

router.post('/add',createNewProduct);

router.get('/products',renderProducts);

router.get('/edit/:id',renderEditForm);

router.put('/edit/:id',editProduct);

router.delete('delete/:id',deleteProduct)

export default router;