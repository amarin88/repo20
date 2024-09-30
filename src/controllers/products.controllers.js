import { generateProductsMocks } from "../mocks/product.mock.js";//Import productos mediante mocking de faker
import productsServices from "../services/products.services.js";//Import product services

const getAll = async (req, res, next) => {
    try {
      const { limit, page, sort, category, status } = req.query;//Obtiene los filtros por query
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: {
          price: sort === "asc" ? 1 : -1,
        },
        lean: true,
      };//Creamos un objeto donde vamos a configurar los parámetros que vamos a utilizar en la query
  
      if (status) {
        const products = await productsServices.getAll({ status: status }, options);
        return res.status(200).json({ status: "success" , products });
      };//Con este condicional filtramos por status
  
      if (category) {
        const products = await productsServices.getAll({ category: category }, options);
        return res.status(200).json({ status: "success" , products });
      };//Con este condicional filtramos por categoria
  
      const products = await productsServices.getAll({}, options);//En caso de no haber filtros mandamos todos los productos en un objeto
  
      res.status(200).json({ status: "success", payload: products });//Responde con los productos obtenidos
    } catch (error) {
      error.path = "[GET] /api/products";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const getById = async (req, res, next) => {
    try {
      const { pid } = req.params;//Obtiene el parámetro de la ruta "pid" (product id)
      const product = await productsServices.getById(pid);//Obtiene el producto por su ID de la base de datos
      res.status(200).json({ status: "success", payload: product });//Responde con el producto obtenido
    } catch (error) {
      error.path = "[GET] /api/products/:pid";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const create = async (req, res, next) => {
    try {
      const product = req.body;//Obtiene el body de la request que contiene los datos del producto
      const newProduct = await productsServices.create(product, req.user);//Agrega el nuevo producto a la base de datos junto con la información del user
  
      res.status(201).json({ status: "success", payload: newProduct });//Responde con el nuevo producto creado
    } catch (error) {
      error.path = "[POST] /api/products";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const update = async (req, res, next) => {
    try {
      const { pid } = req.params;//Obtiene el parámetro de la ruta "pid" (product id)
      const productData = req.body;//Obtiene el body de la request que contiene los nuevos datos del producto
      const updateProduct = await productsServices.update(pid, productData);//Obtiene el id y actualiza el producto en la base de datos
  
      res.status(200).json({ status: "success", payload: updateProduct });//Responde con el producto actualizado
    } catch (error) {
      error.path = "[PUT] /api/products";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const deleteOne = async (req, res, next) => {
    try {
      const { pid } = req.params;//Obtiene el parámetro de la ruta "pid" (product id)
      const product = await productsServices.deleteOne(pid, req.user);//Obtiene el producto por id junto con la información del user y lo elimina de la base de datos 
      res.status(200).json({
        status: "success",
        payload: `The product with id number: ${pid} has been successfully deleted.`,
        product, //Retorna el producto eliminado para más detalles
      });//Responde con un mensaje de éxito
    } catch (error) {
      error.path = "[DEL] /api/products/:pid";
      next(error);//Continua el flujo al middleware de errors
    }
  };

const createProductsMocks = async (req, res, next) =>{
  try {
      const products = generateProductsMocks(100);
      return res.status(200).json({status: "success" , products});
    } catch (error) {
      error.path = "[GET] /api/products/mockingproducts";
      next(error);//Continua el flujo al middleware de errors
  };
};

export default { getAll, getById, create, update, deleteOne, createProductsMocks};//Export de controllers