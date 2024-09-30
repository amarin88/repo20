import { Router } from "express";//Import router de express
import passport from "passport";//Import de passport
import sessionController from "../controllers/session.controllers.js";//Import controller de sessions
import { authorization, passportCall } from "../middlewares/passport.middleware.js";//Import de validacion de rol de usuario


const router = Router();//Inicializador del router de express

router.post("/register",passport.authenticate("register"),sessionController.register);//Ruta para crear una nuevo registro
router.post("/login",passport.authenticate("login"),sessionController.login);//Ruta para login con passport-local
router.get("/google",passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",//Consultar la dirección principal de correo electronico de google
      "https://www.googleapis.com/auth/userinfo.profile",//Permite ver su información personal, incluidos datos personales que haya hecho publicos
    ],session: false,}),sessionController.loginGoogle);//Ruta para login con google
router.get("/current",passportCall("jwt"),authorization("admin"),sessionController.current);//Ruta para validación de token
router.get("/logout", sessionController.sessionDestroy);//Ruta para deslogueo

export default router;