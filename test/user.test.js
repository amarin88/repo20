import mongoose from "mongoose";
import envConfig from "../src/config/env.config.js";
import usersRepository from "../src/persistences/mongo/repositories/users.repository.js";
import { expect } from "chai";

mongoose.connect(envConfig.MONGO_URL);

describe("Test User Repository", () => {

    // before( () => {
    //     console.log(" Se ejecuta antes de todos los tests ");
    // })

    // beforeEach(()=>{
    //     console.log(" Se ejecuta antes de cada test ");
    // })

    it( "Get all users", async () => {
        const users = await usersRepository.getAll();
        expect(users).to.be.an("array"); //"string", "boolean"
    } )

    let userId;
    let userEmail;

    it( "Create one user", async () => {
        const newUser = {
            first_name: 'Usuario0',
            last_name: 'Test0',
            email: 'usuario0@test.com',
            password: '12345',
            age: 0
        }

        const user = await usersRepository.create(newUser);
        userId = user._id
        userEmail = user.email
        expect(user.first_name).to.equal("Usuario0");
        expect(user.email).to.equal("usuario0@test.com");
        expect(user.role).to.equal("user");
    } )

    it( "Get one user", async () => {
        const user = await usersRepository.getById(userId);
        expect(user).to.be.an("object");
        
    } )

    it( "Get by email", async () => {
        const user = await usersRepository.getByEmail(userEmail);
        expect(user.email).to.equal("usuario0@test.com");
        expect(user).to.be.an("object");
        
    } )

    it( "Update user", async () => {
        const user = await usersRepository.update(userId,{
            first_name: 'Usuario01',
            last_name: 'Test01',
            age: 1
        });

        expect(user.first_name).to.equal("Usuario01");
        expect(user.last_name).to.equal("Test01");
        expect(user.age).to.equal(1);
        expect(user).to.be.an("object");
        
    } )

    it( "Delete one user", async () => {
        await usersRepository.deleteOne(userId);
        const user = await usersRepository.getById(userId);
        expect(user).to.be.null;
        
    } )

    after( async () => {        
        await usersRepository.deleteOne(userId);
        mongoose.disconnect();
        console.log("Test finished");
    })

    // afterEach(() =>{
    //     console.log("Se ejecuta al final cada test")
    // })
});
