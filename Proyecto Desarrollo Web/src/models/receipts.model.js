import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  buyedProducts: [
    {
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      image: {
        type: String,
        required: true,
        default:
          "https://i.pinimg.com/736x/3f/97/38/3f973871057b3f076e38f5c1413b06e6.jpg",
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'La cantidad debe ser al menos 1'],
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
    min: [0, 'El total no puede ser negativo'],
  },
});

const receiptModel = mongoose.model("receipt", receiptSchema);

export default receiptModel;