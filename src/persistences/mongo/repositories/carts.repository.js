import { cartModel } from "../models/cart.model.js";//Import cart model
import customErrors from "../../../errors/customErrors.js";//Import manejo de errores personalizados

const getCartById = async (id) => {
  const cart = await cartModel.findById(id);
  return cart;
};//Función asincrona que recibe un id, busca el carrito que contenga ese id y lo retorna

const createCart = async (data) => {
  const cart = await cartModel.create(data);
  return cart;
};//Función asincrona que recibe la data que contendrá el carrito, y devuelve el carrito creado

const addProductToCart = async (cid, pid) => {
  const productInCart = await cartModel.findOneAndUpdate(//Intenta encontrar un carrito y actualizar la cantidad del producto si ya está en el carrito  
    { _id: cid, "products.product": pid },
    { $inc: { "products.$.quantity": 1 } },
    { new: true }
  );

  if (!productInCart) {
    await cartModel.findOneAndUpdate(
      { _id: cid },
      { $push: { products: { product: pid, quantity: 1 } } },
      { new: true }
    );//Si el producto no está en el carrito, añade el producto al carrito con cantidad 1
    return await cartModel.findById(cid);//Devuelve el carrito actualizado con el nuevo producto
  }

  return productInCart;//Devuelve el carrito con la cantidad del producto incrementada
};//Función asincrona que recibe el id del carrito y el id de un producto, busca el id del producto, sino lo encuentra arroja error, si lo encuentra busca el carrito por id para agregarlo, en caso de no encontrar el carrito también arroja error. Si la funcion se cumple devuelve el carrito con el producto agregado

const updateQuantityProductInCart = async (cid, pid, quantity) => {
  const cart = await cartModel.findOneAndUpdate(
    { _id: cid, "products.product": pid },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );//Busca el cart por id en la base de datos, busca el producto en el array a traves de mongoose por id. Actualiza la quantity con el parametro recibido

  return cart;//Retorna el carrito actualizado
};

const deleteProductInCart = async (cid, pid) => {
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": -1 } },
      { new: true }
    );//Busca el carrito por id en la base de datos, busca el producto en el array a traves de mongoose por id. Actualiza la quantity restandole 1 a traves del operador de mongoose llamado inc
    if (!cart) throw customErrors.cartNotFoundError();
    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) throw customErrors.productNotFoundError();
    if (product.quantity <= 0) {
      await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      );
    };
    return cart;//Retorna el carrito actualizado
  };//Función asincrona que recibe el id del carrito y el id del producto para eliminarlo del carrito

const deleteAllProductsInCart = async (cid) => {
  const cart = await cartModel.findByIdAndUpdate(
    cid,
    { $set: { products: [] } },
    { new: true }
  );//Busca el carrito por id y setea el array de productos en 0

  return cart;//Retorna el carrito vacio
};//Función asincrona que recibe el id del carrito y elimina todos los productos del carrito

const updateCart = async (cid,products) =>{
  const cart = await cartModel.findByIdAndUpdate(
    cid,
    {$set: { products }},
    {new: true}

  );
  return cart;
};//Función asincrona que recibe el id del carrito y los productos del carrito y actualiza el carrito con los productos agregados

export default {
  getCartById,
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  deleteAllProductsInCart,
  updateCart
};//Export de todas las funciones
