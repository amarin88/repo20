import cartsServices from "../services/carts.services.js";//Import cart services
import ticketsServices from "../services/tickets.services.js"//Import ticket services

const createCart = async (req, res, next) => {
  try {
    const cart = await cartsServices.createCart();//Crea el carrito en la base de datos

    res.status(201).json({ status: "success", payload: cart });//Responde con el carrito creado y el código de estado 201 (creado)
  } catch (error) {
    error.path = "[GET] /api/carts";
    next(error);//Continua el flujo al middleware de errors
    }
  };

const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;//Obtiene los parámetros de la ruta "cid"(cart id) y "pid" (product id)
    const cart = await cartsServices.addProductToCart(cid, pid, req.user);//Recibe el id del carrito y del producto, y agrega el producto al carrito de la base de datos

    res.status(201).json({ status: "success", payload: cart });//Responde con el carrito actualizado en la base de datos
  } catch (error) {
    error.path = "[POST] /api/carts/:cid/product/:pid";
    next(error);//Continua el flujo al middleware de errors
  }
};

const updateQuantityProductInCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;//Obtenemos el id del carrito y del producto por parametro
    const { quantity } = req.body;//Obtenemos la quantity por el cuerpo de la solicitud

    const cart = await cartsServices.updateQuantityProductInCart(
      cid,
      pid,
      quantity
    );//Actualizamos el carrito en la base de datos con la data recibida en quantity

    res.status(200).json({ status: "success", payload: cart });//Devuelve el carrito actualizado
  } catch (error) {
    error.path = "[POST] /api/carts/:cid/product/:pid";
    next(error);//Continua el flujo al middleware de errors
  }
};

const deleteProductInCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;//Obtiene el parámetro de la ruta "cid" (cart id) y "pid" (product id)
    const cart = await cartsServices.deleteProductInCart(cid, pid); //Elimina el producto del carrito

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    error.path = "[DEL] /api/carts/:cid/product/:pid";
    next(error);//Continua el flujo al middleware de errors
  }
};

const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;//Obtiene el parámetro de la ruta "cid" (cart id)
    const cart = await cartsServices.getCartById(cid);//Obtiene el carrito por id en la base de datos

    res.status(200).json({ status: "success", payload: cart });//Responde con los productos del carrito y el código de estado 200 (éxito)
  } catch (error) {
    error.path = "[GET] /api/carts/:cid";
    next(error);//Continua el flujo al middleware de errors
  }
};

const deleteAllProductsInCart = async (req, res, next) => {
  try {
    const { cid } = req.params;//Obtiene el parámetro de la ruta "cid" (cart id)
    const cart = await cartsServices.deleteAllProductsInCart(cid);//Obtiene el carrito por id y borra los productos
    
    res.status(200).json({ status: "success", payload: cart });//Devuelve el carrito vacio
  } catch (error) {
    error.path = "[GET] /api/carts/:cid";
    next(error);//Continua el flujo al middleware de errors
  }
};

const purchaseCart = async (req,res, next) =>{
  try {
    const { cid } = req.params;//Obtiene el parámetro de la ruta "cid" (cart id)
    const cart = await cartsServices.getCartById(cid);//Busca el carrito por id

    
    const total = await cartsServices.purchaseCart(cid);//Toma el carrito por id y actualiza con el total de productos
    const ticket = await ticketsServices.createTicket(req.user.email, total);//Crea un ticket recibiendo el total y el nombre de usuario


    res.status(200).json({ status: "success", payload: ticket });//Devuelve el ticket actualizado
  } catch (error) {
    error.path = "[GET] /api/carts/:cid/purchase";
    next(error);//Continua el flujo al middleware de errors
  }
};

export default {
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  getCartById,
  deleteAllProductsInCart,
  purchaseCart
};//Export de controllers de carritos