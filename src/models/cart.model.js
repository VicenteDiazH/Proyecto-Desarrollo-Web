import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CartRelation"
  }],
  amount: {
    type: Number,
    default: 0,
  },
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
