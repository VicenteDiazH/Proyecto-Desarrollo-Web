import cartModel from "../models/cart.model.js";
import productModel from "../models/productos.model.js";
import cartRelationModel from "../models/cartPerProduct.model.js";
import receiptModel from "../models/receipts.model.js";
import userModel from "../models/user.model.js";

export const renderReceipts = async (req, res) => {
  try {
    const user = req.user;
    const idUser = user.id;
    const userreceipt = await userModel.findById(idUser).populate({
      path: 'receipt',
      populate: {
        path: 'relations',
        populate: {
          path: 'product',
        }
      }
    });

    if (!userreceipt) {
      return res.status(404).send('Usuario no encontrado');
    }
    console.log("receipts", userreceipt);
    res.render('receipts', { userreceipt });
  } catch (error) {
    res.status(500).send('Error del servidor');
  }
};

export const crearReceipt = async (user) => {
  try {
    const carrito = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" }, 
    });

    if (!carrito) {
      console.error("No se encontró ningún carrito para el usuario:", user._id);
      return null;
    }

    const productsreceipt = carrito.products.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));

    const newreceipt = new receiptModel({
      relations: productsreceipt,
      total: carrito.amount,
    });

    await newreceipt.save();
    user.receipts.push(newreceipt._id);
    await user.save();

    return newreceipt;
  } catch (error) {
    console.error("Error al crear el recibo:", error);
    return null;
  }
};

export const comprar = async (req, res) => {
  try {
    const user = req.user;
    const cart = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart) {
      return res.status(404).send("No se encontró el carrito");
    }

    if (cart.amount > user.wallet) {
      return res.send("Saldo insuficiente");
    }

    // Crear recibo
    const receipt = await crearReceipt(user);

    // Restar el stock de los productos en el carrito
    for (const relation of cart.products) {
      const product = await productModel.findById(relation.product._id);
      if (product.stock < relation.quantity) {
        return res.status(400).send("Stock insuficiente para el producto: " + product.productName);
      }
      product.stock -= relation.quantity;
      await product.save();
    }

    // Actualizar el saldo del usuario
    user.wallet -= cart.amount;

    // Vaciar el carrito
    cart.amount = 0;
    cart.products = [];
    await cart.save();

    // Guardar los cambios en el usuario
    await user.save();

    res.redirect("/cart");
  } catch (error) {
    console.error("Error al comprar:", error);
    res.status(500).send("Error al realizar la compra");
  }
};

export const renderCart = async (req, res) => {
  try {
    const user = req.user;

    // Encontrar el carrito del usuario y hacer populate de los productos
    const cart = await cartModel.findOne({ user: user }).populate({
      path: "products",
      populate: { path: "product" },
    }).exec();

    if (!cart) {
      // Si no hay carrito, crear uno nuevo
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

// Añadir producto a CART
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
    res.status(500).send("Error al eliminar el producto del carrito");
  }
};
