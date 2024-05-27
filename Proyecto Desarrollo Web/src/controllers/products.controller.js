import producto from "../models/productos.model.js";
export const renderProductForm=(req,res)=>{
    res.render('addProduct')
};

export const createNewProduct=(req,res)=>{
    res.send('new product')
}

export const renderProducts=(req,res)=>{
    res.send('render product')
}

export const  renderEditForm=(req,res)=>{
 res.send('render edit form')
}

export const editProduct=(req,res)=>{
     res.send('edit product')
}

export const deleteProduct=(req,res)=>{
    res.send('delete product')
}