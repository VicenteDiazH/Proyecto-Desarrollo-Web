import mongoose from "mongoose";

const receiptUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  receipt: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "receipt",
    },
  ],
});

const receiptUserModel = mongoose.model("receiptUser", receiptUserSchema);

export default receiptUserModel;
