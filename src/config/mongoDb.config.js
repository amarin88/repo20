import mongoose from "mongoose";//Import de mongoose
import envs from "./env.config.js";//Import de config de variables de entorno
import { logger } from "../utils/logger.js";//Import de config del logger de winston

export const connectMongoDB = async () => {
  try {
    // Conexión con la base de datos
    mongoose.connect(envs.MONGO_URL);
    logger.info("MongoDB successfully connected");
  } catch (error) {
    logger.error("MongoDB cannot connected");
  }
};