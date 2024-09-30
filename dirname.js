import {fileURLToPath} from 'url';// Import de la función fileURLToPath desde el módulo 'url' para convertir una URL en una ruta de archivo
import { dirname } from 'path';// Import dirname desde el módulo 'path' para obtener el nombre del directorio de un archivo


const __filename = fileURLToPath(import.meta.url);//Convierte la URL del módulo actual (import.meta.url) a una ruta de archivo
const __dirname = dirname(__filename);//Obtiene el directorio del archivo actual usando la ruta del archivo

export default __dirname;//Export del nombre del directorio actual para su uso en otros módulos