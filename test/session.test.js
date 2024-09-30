import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";
import { userModel } from "../src/persistences/mongo/models/user.model.js";
import mongoose from "mongoose";

mongoose.connect(envConfig.MONGO_URL);

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Session test", () => {

    it("[POST] /api/session/register User register", async () => {
        const newUser = {
            "first_name":"User",
            "last_name":"Test",
            "email": "usertest@test.com",
            "password": "12345",
            "age": 18,
            "role": "admin"
        };

        const { status, _body, ok } = await requester.post("/api/session/register").send(newUser);
        
        expect(status).to.be.equal(201);
        expect(ok).to.equal(true);
        expect(_body.status).to.be.equal("success");
    })

    let cookie;

    it("[POST] /api/session/login User login", async () => {
        const loginUser = {
            "email": "usertest@test.com",
            "password": "12345"
        };

        const {  status, _body, ok, headers } = await requester.post("/api/session/login").send(loginUser);
        const cookieResult = headers["set-cookie"][0];  // Obtiene el encabezado "Set-Cookie" de la respuesta HTTP, que contiene la cookie enviada por el servidor.

        cookie = {
            name: cookieResult.split("=")[0],// Obtiene el nombre de la cookie separando la cadena `cookieResult` por el símbolo "=" y tomando la primera parte
            value: cookieResult.split("=")[1],// Obtiene el valor de la cookie separando la cadena `cookieResult` por el símbolo "=" y tomando la segunda parte
        };

        expect(status).to.be.equal(200);
        expect(ok).to.equal(true);
        expect(_body.payload.first_name).to.be.equal("User");        
        expect(_body.payload.email).to.be.equal("usertest@test.com");
        expect(_body.payload.role).to.be.equal("admin");
    })

    it("[GET] /api/session/current User information", async () => {
        const { status, _body, ok } = await requester
        .get("/api/session/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]); // Se utiliza la plantilla literal `${cookie.name}=${cookie.value}` para formar la cookie en el formato "nombre=valor".  

        expect(ok).to.be.equal(true);
        expect(status).to.be.equal(200);
        expect(_body.payload.email).to.be.equal("usertest@test.com");
        expect(_body.payload.role).to.be.equal("admin");
    })

    

    after( async () =>{
        try {

            await userModel.deleteOne({ email: "usertest@test.com" }); // Limpia el usuario de prueba de la base de datos
            await mongoose.disconnect(); // Cierra la conexión de la base de datos
            console.log("Test finished");
        } catch (error) {
            console.error("Error cleaning up:", error); // Manejo de errores para mayor claridad
        }
        
    })
});