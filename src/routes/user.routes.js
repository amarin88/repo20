import { Router } from "express";//Import router de express
import usersControllers from "../controllers/users.controllers.js";// Import de users controllers
import { uploader } from "../utils/uploadFiles.js";//Import de Middleware de manejo de archivos
import { authorization, passportCall } from "../middlewares/passport.middleware.js";//Import el middleware de rol de usuario

const router = Router();//Inicializador del router de express

router.post("/email/reset-password", usersControllers.sendEmailResetPassword);//Ruta para enviar un correo de restablecimiento de contraseña
router.post("/reset-password", usersControllers.resetPassword);//Ruta para restablecer la contraseña
router.get("/premium/:uid", usersControllers.changeUserRole);//Ruta para cambiar el rol de un usuario a premium
router.post("/:uid/documents", 
    passportCall("jwt"), 
    authorization(["user","premium"]),
    uploader.fields([{name: "profile", maxCount: 1}, {name: "imgProduct", maxCount: 1}, {name: "document", maxCount: 3}]), 
    usersControllers.addDocuments);//Ruta para cambiar el rol de un usuario a premium
router.get("/", usersControllers.getUsers); //Ruta para obtener todos los usuarios
router.delete("/", usersControllers.deleteInactiveUsers);//Ruta para eliminar inactivos
    
export default router;