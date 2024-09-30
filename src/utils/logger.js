import { createLogger , format, transports, addColors} from "winston";

const { printf, combine, colorize, timestamp } = format;

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3
    },
    colors:{
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "magenta"

    }
};

addColors(customLevels.colors);//Agrega los colores personalizados a winston

const logFormat = printf( ({ level, message, timestamp}) =>{
    return `${timestamp}, ${level}, ${message}`;
});//Formato del log que enviamos

const consoleFormat = combine(
    colorize(),
    timestamp({format: "YYYY-MM-DD HH:mm:ss"}),//Muestra en que momento se produjo el log
    logFormat
);//Formato que se mostrara en consola

export const logger = createLogger({
    levels: customLevels.levels,
    level: 'http',//Establece el nivel mínimo para incluir http
    format: combine(
    timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    logFormat
    ),
    transports: [//Sistema de almacenamiento de los logs
        new transports.Console({format: consoleFormat}),//Permite al logger ejecutar en consola
        new transports.File({ filename: "logs/app.log"}),//Permite al transport guardar en archivo app.log
        new transports.File({ filename: "logs/error.log", format: logFormat, level: "error"}),//Permite al transport guardar en archivo error.log
    ]
});