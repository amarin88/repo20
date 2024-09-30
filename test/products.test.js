import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test products", () =>{
    let cookie;

    before( async ()=>{
        const loginUser = {
            "email": "premium@test.com",
            "password": "12345"
        };

        const { headers } = await requester.post("/api/session/login").send(loginUser)
        
        const cookieResult = headers["set-cookie"][0];  // Obtiene el encabezado "Set-Cookie" de la respuesta HTTP, que contiene la cookie enviada por el servidor.

        cookie = {
            name: cookieResult.split("=")[0],// Obtiene el nombre de la cookie separando la cadena `cookieResult` por el símbolo "=" y tomando la primera parte
            value: cookieResult.split("=")[1],// Obtiene el valor de la cookie separando la cadena `cookieResult` por el símbolo "=" y tomando la segunda parte
        };
    });

    let productId;
    it("[POST] /api/products Create products", async () => {
        const newProduct = 
        {
            "title": "Test",
            "description": "Product Test",
            "category": "Category Test",
            "price": 250,
            "thumbnail": ["product_test.jpg"],
            "stock": 10,
            "code": "TEST012",
            "status": true
        }

        const { status, _body, ok} = await requester
        .post("/api/products")
        .send(newProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]); // Se utiliza la plantilla literal `${cookie.name}=${cookie.value}` para formar la cookie en el formato "nombre=valor".  
        
        productId = _body.payload._id;

        expect(status).to.be.equal(201);
        expect(_body.payload.title).to.equal("Test");
        expect(_body.payload.description).to.equal("Product Test");
        expect(_body.payload.category).to.equal("Category Test");
        expect(_body.payload.price).to.equal(250);
        expect(_body.payload.thumbnail).to.be.an('array');
        expect(_body.payload.stock).to.equal(10);
        expect(_body.payload.code).to.equal("TEST012");
        expect(_body.payload.status).to.equal(true);
        expect(ok).to.equal(true);

    });

    it("[GET] api/products Get All products", async ()=>{
        const { status, _body, ok} = await requester.get(`/api/products`);
    
        expect(status).to.be.equal(200);
        expect(ok).to.equal(true);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.have.property('docs');
        expect(_body.payload.docs).to.be.an('array');
    });

    it("[GET] /api/products/:pid Get Product by Id", async ()=>{
        const { status, _body, ok} = await requester.get(`/api/products/${productId}`)

        expect(status).to.be.equal(200);
        expect(_body.payload.title).to.equal("Test");        
        expect(_body.payload.description).to.equal("Product Test");
        expect(_body.payload.category).to.equal("Category Test");
        expect(_body.payload.price).to.equal(250);
        expect(_body.payload.thumbnail).to.be.an('array');
        expect(_body.payload.stock).to.equal(10);
        expect(ok).to.equal(true);
    });

    it("[PUT] /api/products/:pid Get Product by Id", async ()=>{
        
        const updatedData = 
        {
            "title": "TestUpdated",
            "description": "Product Test Updated",
            "category": "Category Test Updated",
            "price": 300,
            "thumbnail": ["product_test_updated.jpg"],
            "stock": 20,
            "code": "TESTUPDATED012",
            "status": false
        }

        const { status, _body, ok} = await requester
        .put(`/api/products/${productId}`)
        .send(updatedData)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]); // Se utiliza la plantilla literal `${cookie.name}=${cookie.value}` para formar la cookie en el formato "nombre=valor".

        expect(status).to.be.equal(200);
        expect(_body.payload.title).to.equal("TestUpdated");
        expect(_body.payload.description).to.equal("Product Test Updated");
        expect(_body.payload.category).to.equal("Category Test Updated");
        expect(_body.payload.price).to.equal(300);
        expect(_body.payload.thumbnail).to.be.an('array');
        expect(_body.payload.stock).to.equal(20);
        expect(_body.payload.code).to.equal("TESTUPDATED012");
        expect(_body.payload.status).to.equal(false);
        expect(ok).to.equal(true);
    });


    it("[DELETE] /api/products/:pid Delete products", async () =>{
        const { status, _body, ok  } = await requester
        .delete(`/api/products/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]); // Se utiliza la plantilla literal `${cookie.name}=${cookie.value}` para formar la cookie en el formato "nombre=valor".

        expect(status).to.be.equal(200);
        expect(ok).to.equal(true);
    });
    
    after( async () =>{
        await mongoose.disconnect(); // Cierra la conexión de la base de datos
        console.log("Test finished");
    });

} )