import dotenv from "dotenv";//Import de dotenv para valiables de entorno


//Inicializador de la configuración de dotenv
const environment = "DEV"
dotenv.config({
  path: environment === "PRODUCTION" ? "./.env.prod" : "./.env.dev"
});

export default {
    PORT: process.env.PORT,//Export el puerto del servidor
    MONGO_URL: process.env.MONGO_URL,//Export la url de la base de datos
    SECRET_CODE: process.env.SECRET_CODE,//Export codigo secreto general
    JWT_SECRET: process.env.JWT_SECRET,//Export codigo secreto de JWT
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,//Export Client ID google
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,//Export codigo secreto cliente google
    GOOGLE_MAIL_PASS: process.env.GOOGLE_MAIL_PASS//Export codigo google mailing
};
