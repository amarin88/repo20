import { Router } from "express";//Import del router de Express
import { passportCall, authorization } from "../middlewares/passport.middleware.js";//Import del middleware de rol de usuario
import cartsController from "../controllers/carts.controllers.js"//Import del cart controller
import { checkProductAndCart } from "../middlewares/checkProductsAndCarts.middleware.js"//Import de validación de productos y carritos

const router = Router();//Inicializador del router de express

router.post("/", passportCall("jwt"), authorization("user"), cartsController.createCart );//Ruta para crear un nuevo carrito
router.get("/:cid", passportCall("jwt"), authorization("user"), cartsController.getCartById);//Ruta para obtener los productos de un carrito por su ID
router.post("/:cid/product/:pid", passportCall("jwt"), authorization(["user","premium"]), checkProductAndCart, cartsController.addProductToCart );//Ruta para agregar un producto a un carrito. Requiere autenticación con JWT y autorización para usuarios con rol "user" o "premium"
router.put("/:cid/product/:pid", passportCall("jwt"), authorization(["user","premium"]), checkProductAndCart, cartsController.updateQuantityProductInCart);//Ruta para modificar la quantity del producto por parametro. Requiere autenticación con JWT y autorización para usuarios con rol "user" o "premium"
router.delete("/:cid/product/:pid", passportCall("jwt"), authorization(["user","premium"]), checkProductAndCart, cartsController.deleteProductInCart);//Ruta para borrar un producto del carrito por ID. Requiere autenticación con JWT y autorización para usuarios con rol "user" o "premium"
router.delete("/:cid", passportCall("jwt"), authorization(["user","premium"]), cartsController.deleteAllProductsInCart);//Ruta para vaciar el carrito por ID. Requiere autenticación con JWT y autorización para usuarios con rol "user" o "premium"
router.get("/:cid/purchase", passportCall("jwt"), authorization(["user","premium"]), cartsController.purchaseCart );//Ruta para realizar la compra del carrito. Requiere autenticación con JWT y autorización para usuarios con rol "user" o "premium"

export default router;//Export del router