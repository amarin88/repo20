import { fakerEN_US as faker } from "@faker-js/faker"; // Import de faker para moks de users
import { productModel } from "../persistences/mongo/models/product.model.js";//Import product model en las persistencias de mongo


export const generateProductsMocks = (amount) => {
  const products = [];

  for (let i = 0; i < amount; i++) {
    const product = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1, max: 20}),
    thumbnail: faker.system.commonFileName('jpg'),
    code: faker.string.hexadecimal({ length: 6, casing: 'upper' }),
    stock: faker.number.int({ min: 0, max: 100 }),
    status: faker.datatype.boolean(),
    category: faker.commerce.department()

    };

    products.push(product);
  }
  productModel.insertMany(products);
  return products;
};