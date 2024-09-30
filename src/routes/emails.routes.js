import { Router } from "express";//Import del router de express
import { passportCall, authorization } from "../middlewares/passport.middleware.js";//Import del middleware de rol de usuario
import emailsControllers from "../controllers/emails.controllers.js";//Import controller de emails

const router = Router();//Inicializador del router de express

router.get("/send", passportCall("jwt"), authorization("admin"), emailsControllers.sendEmail );//Ruta para envio de emails

export default router;