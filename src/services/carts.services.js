import cartsRepository from "../persistences/mongo/repositories/carts.repository.js";//Import de cart services
import productsRepository from "../persistences/mongo/repositories/products.repository.js";//Import de product repositories
import customErrors from "../errors/customErrors.js"//Import config de errors

const getCartById = async (id) => {
  const cart = await cartsRepository.getCartById(id);
  if(!cart) throw customErrors.cartNotFoundError();
  return cart;
};//Función asyncrona para buscar un carrito por id en la base de datos

const createCart = async () => {
  const cart = await cartsRepository.createCart();
  return cart;
};//Función asyncrona para crear un carrito en la base de datos

const addProductToCart = async (cid, pid, user) => {
  const product = await productsRepository.getById(pid);//Busca el producto en el repositorio por su ID
  if(!product) throw customErrors.productNotFoundError(); //Si no se encuentra el producto, lanza un error
  const cart = await cartsRepository.getCartById(cid);//Busca el cart por Id
  if(!cart) throw customErrors.cartNotFoundError();//Si no se encuentra el carrito, lanza un error
  
  if(user.role === "premium" && product.owner === user._id){//Verifica si el usuario es "premium" y si es el dueño del producto
    throw customErrors.unauthorizedError("User not authorized");//Si es así, lanza un error porque un usuario premium no puede comprar su propio producto
  };
    
  return await cartsRepository.addProductToCart(cid, pid);
};//Función asyncrona para agregar un producto del carrito en la base de datos

const updateQuantityProductInCart = async (cid, pid, quantity) => {
  const cart = await cartsRepository.getCartById(cid);//Obtiene el carrito por id
  if (!cart) throw customErrors.cartNotFoundError();

  const product = await productsRepository.getById(pid);//Obtiene el producto por id
  if (!product) throw customErrors.productNotFoundError();

  const updatedCart = await cartsRepository.updateQuantityProductInCart(cid, pid, quantity);
  if (!updatedCart) throw customErrors.cartNotFoundError();//Verifica que el carrito se actualizó

  return updatedCart;
};//Función asyncrona para actualizar la cantidad de un producto del carrito en la base de datos

const deleteProductInCart = async (cid, pid) => {
  const cart = await cartsRepository.getCartById(cid);
  if(!cart) throw customErrors.cartNotFoundError();
  const product = await productsRepository.getById(pid);
  if (!product) throw customErrors.productNotFoundError();
  return await cartsRepository.deleteProductInCart(cid, pid);
};//Función asyncrona para borrar un producto del carrito en la base de datos

const deleteAllProductsInCart = async (cid) => {
  const cart = await cartsRepository.getCartById(cid);
  if(!cart) throw customErrors.cartNotFoundError();
  return await cartsRepository.deleteAllProductsInCart(cid);  
};//Función asyncrona para borrar todos los productos del carrito en la base de datos

const purchaseCart = async (cid) => {
  const cart = await cartsRepository.getCartById(cid);
  if(!cart) throw customErrors.cartNotFoundError();
  let total = 0;
  const products = [];

  for (const product of cart.products){//Este bucle for recorre todos los elementos (productos) en el arreglo cart.products. Cada elemento del arreglo se asigna a la variable product en cada iteración.
      const prod = await productsRepository.getById(product.product);//GetById consulta un repositorio para obtener información detallada del producto, como su precio y su stock disponible.
      if(!prod) throw customErrors.productNotFoundError();
      if(prod.stock >= product.quantity) {//Se comprueba si el stock disponible del producto (prod.stock) es mayor o igual a la cantidad que se quiere comprar (product.quantity).
        total += prod.price * product.quantity//Si hay suficiente stock, se agrega al total del carrito (total) el costo del producto actual multiplicado por la cantidad que se quiere comprar (prod.price * product.quantity).
      } else {
        products.push(product)
      }//Si no hay suficiente stock, el producto actual se agrega a un arreglo llamado products.

    await cartsRepository.updateCart(cid, products )//Muestra una lista de productos que no pudieron ser añadidos al carrito debido a la falta de stock.
  };

  return total;//Devuelve el total de la suma de los productos * la cantidad
};

export default {
  getCartById,
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  deleteAllProductsInCart,
  purchaseCart,
};//Export de los cart services