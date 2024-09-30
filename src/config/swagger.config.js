import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../../dirname.js";

const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.1",
        info: {
            title: "E-commerce Api Documentation",
            version: "1.0.1",
            description: "Practicing from Coderhouse Backend´s course"
        },//Información básica sobre la API
    },
    apis: [`${__dirname}/src/docs/**/*.yaml`]//Indica la ubicación de los archivos YAML donde se documentan los endpoints de la API
};//Configuración de las opciones para Swagger

export const specs = swaggerJSDoc(swaggerOptions);

