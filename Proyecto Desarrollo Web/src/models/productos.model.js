import mongoose from "mongoose";    

const productoSchema=new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true, unique: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    bandName: { type: String, required: true, unique: true },


  
});
const productModel=mongoose.model("Producto",productoSchema); 
export default productModel;