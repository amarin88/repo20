import productsRepository from "../persistences/mongo/repositories/products.repository.js";//Import para persistencia de productos
import { productResponseDto } from "../dto/productResponse.dto.js";//Import de DTO de products
import customErrors from "../errors/customErrors.js"//Import config de errors
import emailService from "../services/email.services.js"; //Import para el service de correos

const getAll = async (query , options) =>{
    const products = await productsRepository.getAll(query, options);
    if(!products) throw customErrors.productNotFoundError();
    return products;
};//Función asyncrona para buscar todos los productos en la base de datos

const getById = async ( id ) =>{
    const productData = await productsRepository.getById(id);
    if(!productData) throw customErrors.productNotFoundError();
    const product = productResponseDto(productData);
    return product;
};//Función asyncrona para buscar productos en la base de datos por id

const create = async (data, user) =>{
    let productData = data;
    if(user.role === "premium"){//Verifica si el rol del usuario es "premium"
        productData = {...data, owner: user._id};//Si el usuario es premium, agrega el campo 'owner' con el ID del usuario al objeto de datos del producto
    };
    const product = await productsRepository.create(productData);
    return product;
};//Función asyncrona para agregar un producto a la base de datos

const update = async (id, data) =>{
    const product = await productsRepository.update(id, data);
    return product;
};//Función asyncrona para actualizar un producto a la base de datos

const deleteOne = async ( id, user ) =>{
    const productData = await productsRepository.getById(id);
    if (!productData) throw customErrors.productNotFoundError();

    if(user.role === "premium" && productData.owner !== user._id){//Verifica si el usuario es "premium" y si no es el dueño del producto
        throw customErrors.unauthorizedError("User not authorized to delete this product.");
    };

    const deletedProduct = await productsRepository.deleteOne(id);
    if (!deletedProduct) throw customErrors.productNotFoundError();

    
    if (user.role === "premium") {//Enviar correo al usuario premium cuando el producto es eliminado
        await emailService.sendProductDeletedNotification(user.email, productData.title);
    };

    return deletedProduct;
};//Función asyncrona para borrar un producto a la base de datos

export default { getAll, getById, create, update, deleteOne};//Export de los product services