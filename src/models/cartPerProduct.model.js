import mongoose from "mongoose";

const cartRelationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const cartRelationModel = mongoose.model("CartRelation", cartRelationSchema);

export default cartRelationModel;