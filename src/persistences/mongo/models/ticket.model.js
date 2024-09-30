import mongoose from "mongoose";//Import de mongoose

const ticketCollection = "tickets";//Nombre de la colección

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,

  },
  purchase_datatime: {
    type: Date,
    default: Date.now(),

  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true
  }
});//Esquema del carrito, array de objetos que va a mostrar el producto con su objectId que va a tomar como referencia products y la cantidad agregada o quantity

ticketSchema.pre("find", function () {
  this.populate("products.product");
});//Middleware de mongoose para hacer la populación del carrito con los productos dentro del carrito

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);