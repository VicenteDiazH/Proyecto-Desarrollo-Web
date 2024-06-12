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
      console.error("No se encontró ningún carrito para el usuario:");
      return null;
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

    console.log("receipt added: ", receiptUser);
  } catch (error) {
    console.log(error);
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
      return res.status(404).send("Usuario no encontrado");
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

    console.log("recibos", receiptUser);

    res.render("recibos", { receiptToRender });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error del servidor");
  }
};

export const comprar = async (req, res) => {
  const user = req.user;

  try {
    const cart = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart) {
      return res.status(404).send("No se encontró el carrito");
    }

    if (cart.amount > user.wallet) {
      res.send("Saldo insuficiente");
      return;
    }

    await createReceipt(user);

    for (const relation of cart.products) {
      const product = relation.product;
      if (product.stock < relation.quantity) {
        return res.status(400).send("Stock insuficiente para el producto: " + product.productName);
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

    req.flash('success_msg', "Producto comprado con éxito!");
    res.redirect("/recibos");
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    res.status(500).send("Error al realizar la compra");
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
