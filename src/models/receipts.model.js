import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productos: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
        },
        qty: Number,
    }],
    total: Number,
});

const receiptModel = mongoose.model("receipt", receiptSchema);

export default receiptModel;
