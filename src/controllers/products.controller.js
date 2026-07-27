import producto from "../models/productos.model.js";
export const renderProductForm=(req,res)=>{
    res.render('addProduct')
};

export const createNewProduct = async (req, res) => {
  try {
    const { productName, price, description, stock, bandName, image } = req.body;
    
    const numPrice = Number(price);
    const numStock = Number(stock);

    if (!productName || price === undefined || !description || stock === undefined || !bandName) {
      req.flash('error_msg', 'Por favor, completa todos los campos obligatorios del producto.');
      return res.redirect('/addProduct');
    }

    if (isNaN(numPrice) || numPrice < 0) {
      req.flash('error_msg', 'El precio debe ser un número válido mayor o igual a 0.');
      return res.redirect('/addProduct');
    }

    if (isNaN(numStock) || numStock < 0) {
      req.flash('error_msg', 'El stock debe ser un número válido mayor o igual a 0.');
      return res.redirect('/addProduct');
    }

    const productData = {
      productName: productName.trim(),
      price: numPrice,
      description: description.trim(),
      stock: numStock,
      bandName: bandName.trim()
    };

    if (image && image.trim() !== '') {
      productData.image = image.trim();
    }

    const newProducto = new producto(productData);
    await newProducto.save();
    req.flash('success_msg', 'Producto creado exitosamente.');
    res.redirect('/');
  } catch (error) {
    console.error("Error creando producto:", error);
    req.flash('error_msg', 'Error al crear el producto.');
    res.redirect('/addProduct');
  }
};

export const renderProducts = async (req, res) => {
  try {
    const productos = await producto.find().lean();
    res.render('home', { productos });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render('home', { productos: [] });
  }
};

export const renderEditForm = (req, res) => {
  res.redirect('/');
};

export const editProduct = (req, res) => {
  res.redirect('/');
};

export const renderAlbumPage = async (req, res) => {
  try {
    const product = await producto.findById(req.params.id).lean();
    if (!product) {
      req.flash('error_msg', 'Producto no encontrado');
      return res.redirect('/');
    }
    res.render("albumPages", { product });
  } catch (error) {
    console.error("Error al renderizar página del álbum:", error);
    req.flash('error_msg', 'Producto no encontrado');
    res.redirect('/');
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await producto.findByIdAndDelete(productId).lean();
    
    if (deletedProduct) {
      await cartRelationModel.deleteMany({ product: productId });
      req.flash('success_msg', 'Producto eliminado exitosamente');
    } else {
      req.flash('error_msg', 'Producto no encontrado');
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    req.flash('error_msg', 'Error al eliminar el producto');
    res.redirect("/");
  }
};   