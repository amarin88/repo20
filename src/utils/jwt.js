import jwt from "jsonwebtoken";//Import de JWT
import envs from "../config/env.config.js"//Import de la configuracion de dotenvs

//Crear un token
export const createToken = (user) => {
    const { _id, email, role, cart } = user;//Desestructura y recibe el _id, email, role y carrito del user
    const token = jwt.sign({_id , email, role, cart}, envs.JWT_SECRET, {expiresIn: "2m"} );// Crea el token recibiendo como primer parametro el _id y el email en un objeto, el segundo parametro es el codigo secreto, el tercer parametro hardcodeamos el rol de user como "user", para completar la configuracion debemos agregar el code secret y la duracion del token en este caso 1 minuto 
    return token;//Retorna el token
};

//Verificación de token
export const verifyToken = (token) => {
    try {
      const verification = jwt.verify(token, envs.JWT_SECRET);//Recibe el token y el codigo secreto que debe coincidir con el asignado en el token
      return verification;//Retorna la verificación
    } catch (error) {
      return null;//Si el token expiró devuelve "null" o vacío
    }
  };