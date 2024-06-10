import { Router } from "express";
import mongoose from "mongoose";
import receiptModel from "../models/receipts.model.js";

const routes = new Router();

export const getAllReceipts = async (req, res) => {
    const receipts = await receiptModel.find().lean();
    res.send(receipts);
};

export const getReceiptsByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }
  
    try {
      const receipt = await receiptModel.findById(userId).populate("relations.product").lean();
      if (!receipt) {
        return res.status(404).send("Recibo no encontrado");
      }
      res.render("receipt", { receipt }); // Renderiza una vista llamada 'receipt' y pasa el recibo
    } catch (error) {
      console.error("Error al obtener el recibo:", error);
      res.status(500).send("Error al obtener el recibo");
    }
  };
  
export default routes;