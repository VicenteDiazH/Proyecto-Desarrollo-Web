import producto from "../models/productos.model.js";
export const renderProductForm=(req,res)=>{
    res.render('addProduct')
};

export const createNewProduct=async (req,res)=>{
    const {productName,price,description,stock,bandName, image}=req.body;
    const newProducto=new producto({productName,price,description,stock,bandName, image})
    await newProducto.save();
    res.render('home')
}

export const renderProducts=async (req,res)=>{
const productos =await producto.find().lean();
res.render('home',{productos})
}

export const  renderEditForm=(req,res)=>{
 res.send('render edit form')
}

export const editProduct=(req,res)=>{
     res.send('edit product')
}

export const  renderAlbumPage=async (req,res)=>{
    const product=await  producto.findById(req.params.id).lean()
    res.render("albumPages",{product})
   }

export const  deleteProduct=async (req,res)=>{
const product=await producto.findByIdAndDelete(req.params.id).lean()
res.render("home");
}   