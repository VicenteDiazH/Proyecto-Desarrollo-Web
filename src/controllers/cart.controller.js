import cartModel from "../models/cart.model.js";
import productModel from "../models/productos.model.js";
import cartRelationModel from "../models/cartPerProduct.model.js";
import receiptModel from "../models/receipts.model.js";
import receiptUserModel from "../models/receiptUser.model.js";

export const createReceipt = async (user) => {
  try {
    const cart = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart) {
      return res.status(500).json({
        success: false,
      });
    }

    const productsReceipt = cart.products.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));

    console.log("productsReceipt: ", productsReceipt);

    const newReceipt = new receiptModel({
      buyedProducts: productsReceipt,
      total: cart.amount,
    });

    await newReceipt.save();

    const receiptUser = await receiptUserModel.findOne({ user: user });

    if (!receiptUser) {
      const newReceiptUser = new receiptUserModel({
        user: user,
        receipt: [newReceipt],
      });

      await newReceiptUser.save();

      console.log(
        "new receipt created: ",
        newReceipt,
        "relation: ",
        newReceiptUser
      );
    } else {
      receiptUser.receipt.push(newReceipt);
      await receiptUser.save();
    }

    return res.json({
      success: true,
      receiptUser,
      jwt: token
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

export const renderRecibos = async (req, res) => {
  try {
    const user = req.user;
    const idUser = user.id;

    const receiptUser = await receiptUserModel
      .findOne({ user: user })
      .populate({
        path: "receipt",
        populate: {
          path: "buyedProducts",
        },
      });

    if (!receiptUser) {
      return res.status(403).json({
        success: false,
      });
    }

    const receiptToRender = receiptUser.receipt.map((receipt) => ({
      total: receipt.total,
      products: receipt.buyedProducts.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
      })),
    }));

    res.render("recibos", { receiptToRender });
    return res.json({
      receiptUser,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const renderCart = async (req, res) => {
  try {
    const user = req.user;

    const cart = await cartModel
      .findOne({ user: user })
      .populate({
        path: "products",
        populate: { path: "product" },
      })
      .exec();

    if (!cart) {
      const newCart = new cartModel({ user: user });
      await newCart.save();
      res.render("cart", { productsToRender: [] });
      return;
    }

    const productsToRender = cart.products.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));
    res.render("cart", { productsToRender, amount: cart.amount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al renderizar el carrito");
  }
};


export const addCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const cart = await cartModel.findOne({ user: user });

    const product = await productModel.findById(idProduct);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (!cart) {
      const newRelation = new cartRelationModel({
        product: product,
        quantity: 1,
      });
      await newRelation.save();

      const newCart = new cartModel({
        user: user,
        products: [newRelation._id],
        amount: product.price,
      });
      await newCart.save();
    } else {
      const existingRelation = await cartRelationModel.findOne({
        product: idProduct,
        _id: { $in: cart.products },
      });

      if (existingRelation) {
        existingRelation.quantity += 1;
        cart.amount += product.price;
        await cart.save();
        await existingRelation.save();
      } else {
        const newRelation = new cartRelationModel({
          product: product,
          quantity: 1,
        });
        await newRelation.save();
        cart.products.push(newRelation._id);
        cart.amount += product.price;
        await cart.save();
      }
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al añadir el producto al carrito");
  }
};

export const removeCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const cart = await cartModel.findOne({ user: user });
    const product = await productModel.findById(idProduct);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (!cart) {
      const newRelation = new cartRelationModel({
        product: product,
        quantity: 1,
      });
      await newRelation.save();

      const newCart = new cartModel({
        user: user,
        products: [newRelation._id],
      });
      await newCart.save();
    } else {
      const existingRelation = await cartRelationModel.findOne({
        product: idProduct,
        _id: { $in: cart.products },
      });

      if (existingRelation) {
        existingRelation.quantity -= 1;
        cart.amount -= product.price;
        await cart.save();
        await existingRelation.save();
      } else {
        const newRelation = new cartRelationModel({
          product: product,
          quantity: 1,
        });
        await newRelation.save();
        cart.products.push(newRelation._id);
        await cart.save();
      }
      if (existingRelation.quantity < 1) {
        await cartRelationModel.findByIdAndDelete(existingRelation.id);
      }
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al añadir el producto al carrito");
  }
};
