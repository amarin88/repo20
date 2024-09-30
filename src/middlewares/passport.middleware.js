import passport from "passport";
import { request, response } from "express";
import customErrors from "../errors/customErrors.js";//Import config de errors

export const passportCall = (strategy) => {
  return async (req = request, res = response, next) => {
    passport.authenticate(
      strategy,
      (
        error,
        user,
        info //done (null, false, {response: "texto"})
      ) => {
        if (error) return next(error);
        if (!user)
          return res
            .status(401)
            .json({
              status: "error",
              response: info.response ? info.response : info.toString(),
            }); //En el caso de haber error lo retornamos como string

        req.user = user; //En caso de no haber error devolvemos el usuario

        next();
      }
    )(req, res, next);
  };
}; //Función de orden superior (retornamos una función dentro de una función) que utilizaremos como middleware de autenticación de usuario

export const authorization = (roles) => {
  return async (req = request, res = response, next) => {
    
    try {
        if(!req.user) throw customErrors.notFoundError("User not found");// Verifica si el usuario está presente en la solicitud
        const roleAuth = roles.includes(req.user.role);// Verifica si el rol del usuario está en la lista de roles permitidos
        if(!roleAuth) throw customErrors.unauthorizedError("User not authorized");// Si el usuario está autorizado, pasa al siguiente middleware
        
        next();
    } catch (error) {
        next(error);// Si ocurre algún error, pasa al middleware de manejo de errores
    };
  };
}; //Función middleware de autorización que verifica si el usuario tiene uno de los roles permitidos
