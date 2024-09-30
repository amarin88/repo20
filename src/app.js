//Imports de los módulos necesarios
import express from "express";//Import servidor de express
import router from "./routes/index.js"; // Import el router principal
import { connectMongoDB } from "./config/mongoDb.config.js"; //Import la configuración de MongoDB
import session from "express-session";//Import para iniciar sessions en el servidor
import MongoStore from "connect-mongo";// Import para conectar las sessions con mongo atlas
import passport from "passport";//Import de passport para autenticación de usuarios
import initializePassport from "./config/passport.config.js"; //Import config de passport
import cookieParser from "cookie-parser";//Import de cookie parser
import envs from "./config/env.config.js";//Import de la configuración de las variables de entorno
import { errorHandle } from "./errors/errorHandle.js";//Import del middleware para manejo de errores
import { logger } from "./utils/logger.js";//Import de config de winston logger
import swaggerUiExpress from "swagger-ui-express";//Import de swagger-express
import { specs } from "./config/swagger.config.js";//Import swagger-config

connectMongoDB();//Conecta con mongoDB

const app = express();//Inicializador de express

const ready = () =>
  logger.info(`Server ready on http://localhost:${envs.PORT}. Press Ctrl + C to stop.`);//Configuración del puerto

app.use(express.json());//Middleware para analizar las solicitudes con formato JSON
app.use(express.urlencoded({ extended: true }));//Middleware para analizar las solicitudes con datos codificados en URL
app.use(cookieParser(envs.SECRET_CODE));
app.use(session({
  store: MongoStore.create({
    mongoUrl: envs.MONGO_URL,//URL de la base de datos de mongo con la que se va a conectar
    ttl: 15//Tiempo de vida de la sesión en minutos
  }),
  secret: envs.SECRET_CODE,//Contraseña
  resave: true,//Ponemos true en el caso de la sesión quede inactiva y querramos que se mantenga
  saveUninitialized: true//Ponemos true en el caso de que la sesión no contenga datos y querramos almacenarla igual 
}));

app.use(passport.initialize());//Middleware de inicialización de passport
app.use(passport.session());//Middleware de sesión de passport
initializePassport();//Inicializador del passport local

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));//Inicializador de swagger y la configuración
app.use("/api", router);//Utiliza el router principal bajo el prefijo "/api"

app.use(errorHandle);//Middleware para manejo de errores

app.listen(envs.PORT, ready);//Inicia el servidor en el puerto especificado y muestra un mensaje de confirmación cuando está listo