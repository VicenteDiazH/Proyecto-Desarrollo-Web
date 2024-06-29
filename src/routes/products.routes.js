import { Router } from "express";
import { renderProductForm, renderEditForm, editProduct, deleteProduct, renderAlbumPage } from "../controllers/products.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import producto from "../models/productos.model.js";

const router = Router();

router.get('/addProduct', [isAuthenticated, isAdmin], renderProductForm);

router.post('/addProduct', [isAuthenticated, isAdmin], async (req,res)=> {
    const { productName, price, description, stock, bandName, image } = req.body;
    try {
        const newProducto = new producto({
            productName,
            price,
            description,
            stock,
            bandName,
            image
        });

        await newProducto.save();
        
        return res.status(201).json({
            success: true,
            newProducto
        });
    } catch (error) {
        return res.status(500).json({
            success: false
        });
    };       
});

router.get('/', async (req, res) => {
    try {
        const productos = await producto.find().lean();
        return res.json({
            productos,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
});

router.get('/edit/:id', [isAuthenticated, isAdmin], renderEditForm);

router.put('/edit/:id', async (req,res)=>{
    try{
        const { productName, price, description, stock, bandName, image } = req.body;
        const id = req.params.id
        const updateProducto = await producto.findByIdAndUpdate(
            id, 
            { productName, price, description, stock, bandName, image },
            { new: true }
        );

        return res.json({
            success: true,
            product: updateProducto
        });

    }catch(error){
        return res.status(500).json({
            success: false,
        });
    }
});

router.get('/albumPages/:id', renderAlbumPage);

router.get('/delete/:id', [isAuthenticated, isAdmin], deleteProduct);

export default router;