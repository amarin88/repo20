import multer from "multer";//Import de multer
import path from "path";//Import para manejo de carpetas
import fs from "fs";//Import de filesystem para manejo de archivos
import customErrors from "../errors/customErrors.js";

const directoryHandle = (directories = ["public/uploads/profiles", "public/uploads/products", "public/uploads/documents"]) => {
    directories.forEach(dir => {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });}
        } catch (error) {
            next(error);//Continua el flujo al middleware de errors
        }
    });
};//Verificación y creación de directorios: El uso de fs.existsSync() seguido de fs.mkdirSync() con la opción {recursive: true} es adecuado para asegurar que se creen directorios, incluidos sus subdirectorios si no existen.

directoryHandle();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === "profile"){
            cb(null, "./public/uploads/profiles")
        } else if(file.fieldname === "imgProduct"){
            cb(null, "./public/uploads/products")
        } else if(file.fieldname === "document"){
            cb(null, "./public/uploads/documents")
        } else {
            cb(customErrors.badRequestError("Invalid fieldname"), null);
        }
    },
    filename: (req, file, cb )=>{
        const userId = req.user._id;
        const extension = path.extname(file.originalname);//Función que devuelve la extensión de un archivo (incluyendo el punto, por ej,.jpg,.png,etc).
        const basename = path.basename(file.originalname, extension);//Obtiene el nombre base de un archivo, es decir, el nombre del archivo sin su extensión.

        cb(null,`${basename}-${userId}-${Date.now()}${extension}`);//Crea un nuevo nombre de archivo único, asegurando que no haya colisiones de nombres al subir archivos.
    }
});

export const uploader = multer({storage}); //storage: storage