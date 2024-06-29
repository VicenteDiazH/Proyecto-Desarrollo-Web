import { Router } from "express";
import {
  renderCart,
  addCart,
  removeCart,
  createReceipt,
  renderRecibos,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { informationToken } from "../middlewares/auth.js";

const router = Router();

router.post("/cart", informationToken, async (req, res) => {
  const user = req.user;

  try {
    const cart = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart) {
      return res.status(400).json({
        message: "Bad Request: No se encontró el carrito.",
        success: false,
    })
    }

    if (cart.amount > user.wallet) {
      return res.status(400).json({
        message: "Bad Request: No hay suficiente sueldo",
        success: false,
      })
    }

    await createReceipt(user);

    for (const relation of cart.products) {
      const product = relation.product;
      if (product.stock < relation.quantity) {
        return res.status(400).json({
          message: "Bad Request: Saldo insuficiente para el carrito.",
          success: false,
      })
      }
      product.stock -= relation.quantity;
      await product.save();
    }

    user.wallet -= cart.amount;

    cart.amount = 0;
    cart.products = [];
    await cart.save();

    await user.save();

    await cartModel.findByIdAndDelete(cart._id);

    return res.json({
      success: true,
    })
  } catch (error) {
    return res.status(201).json({
      success: true,
  });
  }
});

router.get("/cart", isAuthenticated, renderCart);

router.post("/albumPages/:id", addCart);

router.post("/addCart/:id", isAuthenticated, addCart);

router.post("/removeCart/:id", isAuthenticated, removeCart);

router.post("/cart", createReceipt);

router.get("/recibos", isAuthenticated, renderRecibos);

export default router;