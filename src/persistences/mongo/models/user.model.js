import mongoose from "mongoose";//Import de mongoose

const userCollection = "user";//Nombre de la colección

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  age: Number,
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  documents: [{name: String, reference: String}],
  last_connection: Date,
});//Esquema del usuario, array de objetos que va a mostrar el usuario con su objectId

export const userModel = mongoose.model(userCollection, userSchema);