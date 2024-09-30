import { Router } from "express";//Import router de express
import { logger } from "../utils/logger.js";//Import de config de winston logger

const router = Router();//Inicializador del router de express

router.get("/", ( req,res) => {
    console.log("---------------")
    logger.info("Info message");
    logger.error("Error message");
    logger.warn("Warning message");
    logger.http("HTTP message");
    console.log("---------------")

    res.status(200).json({ status: "success"});
  });

export default router;