import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";
import mongoose from "mongoose";

mongoose.connect(envConfig.MONGO_URL);

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test carts", () => {
    let cookie;
    let cartId = "66d541673a622721f813ec76";
    let productId = "66aef34af09217e388bd2820";

    before(async () => {
    
    const loginUser = {
        email: "user-test@test.com",
        password: "12345",
    };

    const { headers } = await requester
        .post("/api/session/login")
        .send(loginUser);
    const cookieResult = headers["set-cookie"][0];

    cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
    };
    });

    it("[POST] /api/carts Create cart", async () => {
    const { status, _body, ok } = await requester
        .post("/api/carts")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.be.equal(201);
    expect(_body).to.have.property("payload");
    expect(_body.payload).to.have.property("_id");
    cartId = _body.payload._id;
    expect(ok).to.equal(true);
    });

    it("[GET] /api/carts/:cid Get cart by ID", async () => {
    const { status, _body, ok } = await requester
        .get(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.be.equal(200);
    expect(_body.payload).to.have.property("_id", cartId);
    expect(_body.payload.products).to.be.an("array");
    expect(ok).to.equal(true);
    });

    it("[DELETE] /api/carts/:cid Empty cart by ID", async () => {
    const { status, _body, ok } = await requester
        .delete(`/api/carts/${cartId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.be.equal(200);
    expect(_body.payload.products).to.be.an("array").that.is.empty;
    expect(ok).to.equal(true);
    });

    it("[GET] /api/carts/:cid/purchase Purchase cart", async () => {
    const { status, _body, ok } = await requester
        .get(`/api/carts/${cartId}/purchase`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(status).to.be.equal(200);
    expect(ok).to.equal(true);
    });

    it("[POST] /api/carts/:cid/product/:pid Add product to cart", async () => {
    const { status, _body, ok } = await requester
        .post(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.equal(201);
    expect(_body.payload).to.have.property("products").that.is.an("array");
    const productInCart = _body.payload.products.find((p) => p.product.toString() === productId);
    expect(productInCart).to.not.be.undefined; // Verifica que el producto esté presente en el carrito
    expect(productInCart).to.have.property("quantity").that.is.a("number");
    expect(ok).to.equal(true);
    });

    it("[PUT] /api/carts/:cid/product/:pid Update product quantity in cart", async () => {
    const newQuantity = { quantity: 5 };
    const { status, _body, ok } = await requester
        .put(`/api/carts/${cartId}/product/${productId}`)
        .send(newQuantity)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.be.equal(200);
    expect(_body.payload).to.have.property("products").that.is.an("array");
    expect(_body.payload.products.find((p) => p.product === productId)).to.have.property("quantity", newQuantity.quantity);
    expect(ok).to.equal(true);
    });

    it("[DELETE] /api/carts/:cid/product/:pid Remove product from cart", async () => {
    const { status, _body, ok } = await requester
        .delete(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(status).to.be.equal(200);
    expect(_body.payload.products).to.be.an("array").that.does.not.deep.include({ product: productId });
    expect(ok).to.equal(true);
    });

    after( async () =>{
            await mongoose.disconnect(); // Cierra la conexión de la base de datos
            console.log("Test finished");
    });
});