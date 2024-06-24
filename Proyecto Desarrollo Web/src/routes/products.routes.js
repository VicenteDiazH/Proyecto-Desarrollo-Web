import { Router } from "express";
import { renderProductForm, createNewProduct, renderEditForm, editProduct, deleteProduct, renderAlbumPage } from "../controllers/products.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.get('/addProduct', [isAuthenticated, isAdmin], renderProductForm);

router.post('/addProduct',  createNewProduct);

router.get('/', async (req,res)=> {
    try{
        const productos =await productos.find().lean();
        return res.json({
            productos,
        });
    } catch (error){
        return res.status(500).json({
            success: false,
        });
    }
});

router.get('/edit/:id', [isAuthenticated, isAdmin], renderEditForm);

router.put('/edit/:id', [isAuthenticated, isAdmin], editProduct);

router.get('/albumPages/:id', renderAlbumPage);

router.get('/delete/:id', [isAuthenticated, isAdmin], deleteProduct);

export default router;