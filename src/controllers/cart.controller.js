import cartModel from "../models/cart.model.js";
import productModel from "../models/productos.model.js";
import cartRelationModel from "../models/cartPerProduct.model.js";
import receiptModel from "../models/receipts.model.js";
import receiptUserModel from "../models/receiptUser.model.js";

export const createReceipt = async (user, productsReceipt, totalAmount) => {
  try {
    const newReceipt = new receiptModel({
      buyedProducts: productsReceipt,
      total: totalAmount,
    });

    await newReceipt.save();

    let receiptUser = await receiptUserModel.findOne({ user: user._id || user });

    if (!receiptUser) {
      receiptUser = new receiptUserModel({
        user: user._id || user,
        receipt: [newReceipt._id],
      });
    } else {
      receiptUser.receipt.push(newReceipt._id);
    }
    await receiptUser.save();
    return newReceipt;
  } catch (error) {
    console.error("Error al crear recibo:", error);
    throw error;
  }
};

export const renderRecibos = async (req, res) => {
  try {
    const user = req.user;

    const receiptUser = await receiptUserModel
      .findOne({ user: user._id || user })
      .populate({
        path: "receipt",
        populate: {
          path: "buyedProducts",
        },
      });

    if (!receiptUser || !receiptUser.receipt) {
      return res.render("recibos", { receiptToRender: [] });
    }

    const receiptToRender = receiptUser.receipt
      .filter((r) => r != null)
      .map((receipt) => ({
        total: receipt.total,
        products: (receipt.buyedProducts || []).map((product) => ({
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
          image: product.image,
        })),
      }));

    res.render("recibos", { receiptToRender });
  } catch (error) {
    console.error("Error al renderizar recibos:", error);
    res.status(500).send("Error del servidor");
  }
};

export const comprar = async (req, res) => {
  const user = req.user;

  try {
    const cart = await cartModel.findOne({ user: user._id || user }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart || !cart.products || cart.products.length === 0) {
      req.flash('error_msg', 'Tu carrito está vacío');
      return res.redirect("/cart");
    }

    const validRelations = cart.products.filter(rel => rel && rel.product);

    if (validRelations.length === 0) {
      req.flash('error_msg', 'Los productos en tu carrito ya no están disponibles');
      cart.products = [];
      cart.amount = 0;
      await cart.save();
      return res.redirect("/cart");
    }

    for (const relation of validRelations) {
      const product = relation.product;
      if (product.stock < relation.quantity) {
        req.flash('error_msg', 'Stock insuficiente para: ' + product.productName);
        return res.redirect("/cart");
      }
    }

    if (cart.amount > user.wallet) {
      req.flash('error_msg', 'Saldo insuficiente en tu wallet');
      return res.redirect("/cart");
    }

    for (const relation of validRelations) {
      const product = relation.product;
      product.stock -= relation.quantity;
      await product.save();
    }

    user.wallet -= cart.amount;
    await user.save();

    const productsReceipt = validRelations.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));

    await createReceipt(user, productsReceipt, cart.amount);

    const relationIds = cart.products;
    cart.amount = 0;
    cart.products = [];
    await cart.save();

    if (relationIds && relationIds.length > 0) {
      await cartRelationModel.deleteMany({ _id: { $in: relationIds } });
    }

    req.flash('success_msg', "¡Compra realizada con éxito!");
    res.redirect("/recibos");
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    req.flash('error_msg', 'Error al procesar la compra');
    res.redirect("/cart");
  }
};

export const renderCart = async (req, res) => {
  try {
    const user = req.user;

    let cart = await cartModel
      .findOne({ user: user._id || user })
      .populate({
        path: "products",
        populate: { path: "product" },
      })
      .exec();

    if (!cart) {
      cart = new cartModel({ user: user._id || user });
      await cart.save();
      return res.render("cart", { productsToRender: [], amount: 0 });
    }

    const validRelations = (cart.products || []).filter(
      (relation) => relation && relation.product
    );

    const recalculatedAmount = validRelations.reduce(
      (sum, rel) => sum + rel.product.price * rel.quantity,
      0
    );

    if (cart.amount !== recalculatedAmount) {
      cart.amount = recalculatedAmount;
      await cart.save();
    }

    const productsToRender = validRelations.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
      bandName: relation.product.bandName
    }));

    res.render("cart", { productsToRender, amount: cart.amount });
  } catch (error) {
    console.error("Error al renderizar el carrito:", error);
    res.status(500).send("Error al renderizar el carrito");
  }
};

export const addCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const product = await productModel.findById(idProduct);

    if (!product) {
      req.flash('error_msg', 'Producto no encontrado');
      return res.redirect("/");
    }

    if (product.stock <= 0) {
      req.flash('error_msg', 'Este producto está agotado');
      return res.redirect("/albumPages/" + idProduct);
    }

    let cart = await cartModel.findOne({ user: user._id || user });

    if (!cart) {
      const newRelation = new cartRelationModel({
        product: product._id,
        quantity: 1,
      });
      await newRelation.save();

      cart = new cartModel({
        user: user._id || user,
        products: [newRelation._id],
        amount: product.price,
      });
      await cart.save();
    } else {
      const existingRelation = await cartRelationModel.findOne({
        product: product._id,
        _id: { $in: cart.products },
      });

      if (existingRelation) {
        if (existingRelation.quantity >= product.stock) {
          req.flash('error_msg', 'No puedes añadir más unidades que el stock disponible');
          return res.redirect("/cart");
        }
        existingRelation.quantity += 1;
        cart.amount += product.price;
        await cart.save();
        await existingRelation.save();
      } else {
        const newRelation = new cartRelationModel({
          product: product._id,
          quantity: 1,
        });
        await newRelation.save();
        cart.products.push(newRelation._id);
        cart.amount += product.price;
        await cart.save();
      }
    }

    req.flash('success_msg', 'Producto añadido al carrito');
    res.redirect("/cart");
  } catch (error) {
    console.error("Error al añadir al carrito:", error);
    req.flash('error_msg', 'Error al añadir el producto al carrito');
    res.redirect("/");
  }
};

export const removeCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const cart = await cartModel.findOne({ user: user._id || user });
    const product = await productModel.findById(idProduct);

    if (!cart || !product) {
      return res.redirect("/cart");
    }

    const existingRelation = await cartRelationModel.findOne({
      product: product._id,
      _id: { $in: cart.products },
    });

    if (existingRelation) {
      existingRelation.quantity -= 1;
      cart.amount = Math.max(0, cart.amount - product.price);
      await existingRelation.save();

      if (existingRelation.quantity < 1) {
        cart.products.pull(existingRelation._id);
        await cartRelationModel.findByIdAndDelete(existingRelation._id);
      }
      await cart.save();
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    req.flash('error_msg', 'Error al actualizar el carrito');
    res.redirect("/cart");
  }
};
