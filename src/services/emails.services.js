import { sendMail } from "../utils/sendMails.js";//Import de la función para enviar correos

const sendInactiveUserMail = async (user) => {
  const subject = "Cuenta eliminada por inactividad";
  const message = `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad.`;

  try {
    await sendMail(user.email, subject, message);

  } catch (error) {
    error.path = "[DEL] /api/users/";
    next(error);//Continua el flujo al middleware de errors
  }
};

const sendProductDeletedNotification = async (email, productTitle) => {

  const subject = 'Your product was deleted';
  const message = `The product "${productTitle}" has been removed from our platform.`;

  try {    
    await sendMail(email, subject, message);
  } catch (error) {
    error.path = "[DEL] /api/products/:pid";
    next(error);//Continua el flujo al middleware de errors
  };
};//Función para enviar notificación cuando se elimina un producto de un usuario premium


  export default {
  sendInactiveUserMail,
  sendProductDeletedNotification
};