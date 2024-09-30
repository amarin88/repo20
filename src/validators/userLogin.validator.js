import { body, validationResult } from "express-validator";//Import de express-validator

export const userLoginValidator = [
  body("email")
    .isEmail().withMessage("Incorrect email")//Chequea que el dato que se introduce por body posea @ y .com(etcetera)
    .notEmpty().withMessage("Email must be obligatory"),//Que no se introduzcan datos vacios
  body("password").notEmpty().withMessage("Password must be obligatory"),//Que no se introduzcan datos vacios como password
  (req, res, next) => {
    const errors = validationResult(req);//Valida todo(params, querys) lo que recibimos por request

    if (!errors.isEmpty()) {//Valida si error no viene vacio
      const setErrors = errors.array().map( e => {return {msg: e.msg , data: e.path}})//Seteamos el formato de los errores

      return res.status(400).json({ status: "error", errors: setErrors });//Devuelve el/los error/es
    }
    next();//En el caso de que no haya errores continua
  },
];
