import { request, response } from "express";//Import de express
import productsServices from "../services/products.services.js";//Import product services
import cartsServices from "../services/carts.services.js";//Import Cart services
import customErrors from "../errors/customErrors.js"; // Importar customErrors

export const checkProductAndCart = async (req = request, res = response, next) => {
  try {
    const { cid, pid } = req.params; // Recibimos el cart id y el product id por params
    const product = await productsServices.getById(pid); // Verificamos si el producto se encuentra por id
    const cart = await cartsServices.getCartById(cid); // Verificamos si el cart se encuentra por id

    if (!cart) throw customErrors.cartNotFoundError(); // Usa customErrors para lanzar errores
    if (!product) throw customErrors.productNotFoundError();

    next(); // En el caso de que la verificación esté ok, pasa el middleware
  } catch (error) {
    next(error); // Pasa el error al siguiente middleware de manejo de errores
  }
};