import { Router } from "express";
import mongoose from "mongoose";
import receiptModel from "../models/receipts.model.js";

const routes = new Router();

export const getAllReceipts = async (req, res) => {
    const receipts = await receiptModel.find().lean();
    res.send(receipts);
};

export const getReceiptsByUserId = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid user ID");
    }
    next();
};
export default routes;