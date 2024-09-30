import mongoose from "mongoose";//Import de mongoose
import mongoosePaginate from "mongoose-paginate-v2";//Import de paginate de mongoose

const productCollection = "products";//Nombre de la colección

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: String,
    default: "admin"
  }
});//Esquema completo del producto, con todos los campos requeridos

productSchema.plugin(mongoosePaginate);//Instalación del plugin para hacer la instalación

export const productModel = mongoose.model(productCollection, productSchema);