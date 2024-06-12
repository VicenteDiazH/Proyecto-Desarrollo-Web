import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  bandName: { type: String, required: true },
  image: {
    type: String,
    required: true,
    default:
      "https://i.pinimg.com/736x/3f/97/38/3f973871057b3f076e38f5c1413b06e6.jpg",
  },
});
const productModel = mongoose.model("Producto", productoSchema);
export default productModel;