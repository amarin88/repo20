import { Router } from "express";//Import del router de Express
import productsController from "../controllers/products.controllers.js";//Import del controller de productos
import { authorization, passportCall } from "../middlewares/passport.middleware.js";//Import del middleware de rol de usuario
import { productDataValidator } from "../validators/productData.validator.js";//Import del validador de productos


const router = Router();//Creación del router

router.get("/", productsController.getAll );//Ruta para obtener todos los productos
router.get("/mockingproducts", productsController.createProductsMocks );//Ruta de los products creados con faker
router.get("/:pid", productsController.getById);//Ruta para obtener un producto por su ID
router.post("/", passportCall("jwt"), authorization(["admin","premium"]), productDataValidator, productsController.create);//Ruta para agregar un nuevo producto. Requiere autenticación con JWT y autorización para usuarios con rol "admin" o "premium"
router.put("/:pid", passportCall("jwt"), authorization(["admin","premium"]), productsController.update);//Ruta para actualizar un producto existente. Requiere autenticación con JWT y autorización para usuarios con rol "admin" o "premium"
router.delete("/:pid", passportCall("jwt"), authorization(["admin","premium"]), productsController.deleteOne);//Ruta para eliminar un producto por su ID. Requiere autenticación con JWT y autorización para usuarios con rol "admin" o "premium"


export default router;//Export del router
