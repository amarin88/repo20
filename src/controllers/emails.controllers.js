import { sendMail } from "../utils/sendMails.js";//Import config de envío de emails


const sendEmail= async (req,res, next) =>{
  
    const { name } = req.body;
    const template = `
          <div>
              <h1> Bienvenido ${name} a nuestra App </h1>
              <img src="cid:cat2" />
          </div>
          `;
          
  
    try {
            await sendMail("a.marin@hotmail.com.ar", "Test nodemailer", "Mensaje de prueba", template);
            res.status(200).json({ status: "ok", msg: "Email sent successfully" });
          } catch (error) {
            error.path = "[GET] /api/products/emails/send";
            next(error);//Continua el flujo al middleware de errors
          };
        };//Función asincrona para enviar emails

export default { sendEmail };