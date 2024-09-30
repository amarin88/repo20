import { createToken } from "../utils/jwt.js";//Import de JWT
import { userResponseDto } from "../dto/userResponse.dto.js";//Import DTO de users

const register = async (req, res, next) => {
    try {
      return res
        .status(201)
        .json({ status: "success", response: "User successfully created" });//Responde con el usuario creado y el código de estado 201 (creado)
    } catch (error) {
      error.path = "[POST] /api/session/register";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const login = async (req, res, next) => {
    try {
      const user = req.user//Recibimos el user por request
      const token = createToken(user);//En caso que exista el email con la contraseña valida, creamos el token con jwt
      res.cookie("token", token, { httpOnly: true });//Guardamos el token en una cookie
      const userDto = userResponseDto(user);//Utilizamos el dto de user

      return res.status(200).json({ status: "success", payload: userDto, token });//Verificamos que los datos ingresados coincidan con los del admin, en caso que si retornamos afirmativamente con los datos configurados en el DTO
    } catch (error) {
      error.path = "[POST] /api/session/login";   
      next(error);//Continua el flujo al middleware de errors
    }
  };

const current = async (req, res, next) => {
    try {
      const user = userResponseDto(req.user);
      return res.status(200).json({ status: "success", payload: user });//Verificamos que los datos ingresados coincidan con los del admin, en caso que si retornamos afirmativamente
    } catch (error) {
      error.path = "[GET] /api/session/current";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const loginGoogle = async (req, res, next) => {
    try {
      return res.status(200).json({ status: "success", payload: req.user });//Verificamos que los datos ingresados coincidan con los del admin, en caso que si retornamos afirmativamente
    } catch (error) {
      error.path = "[GET] /api/session/google";
      next(error);//Continua el flujo al middleware de errors
    }
  };

  const sessionDestroy =  async (req, res, next) => {
    try {
      req.session.destroy();
  
      res
        .status(200)
        .json({ status: "success", response: "Session completed successfully" });
    } catch (error) {
      error.path = "[GET] /api/session/logout";
      next(error);//Continua el flujo al middleware de errors
    }
  };

export default { register, login, current, loginGoogle, sessionDestroy };//Export de session controllers