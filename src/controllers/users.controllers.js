import customErrors from "../errors/customErrors.js";//Import config de errors
import userServices from "../services/users.services.js";//Import de services relacionados con users
import emailServices from "../services/email.services.js"; // Import de services de correos

const sendEmailResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;//Obtiene el email del body

    res.cookie("resetPassword", email, { httpOnly: true, maxAge: 10000 });//Establece una cookie llamada "resetPassword" que almacena el correo electrónico del usuario. La cookie está protegida contra accesos desde JavaScript y tiene una duración de 10 segundos antes de expirar
    const response = await userServices.sendEmailResetPassword(email);//Llama al servicio para enviar el correo de restablecimiento de contraseña
    res.status(200).json({ status: "success", response });//Responde con un mensaje de éxito si el correo fue enviado correctamente
  } catch (error) {
    error.path = "[POST] /api/user/email/reset-password";
    next(error);
  }
};//Controlador para enviar el correo de restablecimiento de contraseña

const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;//Obtiene el email y la nueva contraseña del body
    const emailCookie = req.cookies.resetPassword;//Obtiene la cookie almacenada en el cliente
    if (!emailCookie) throw customErrors.badRequestError("Email link expired");//Verifica si la cookie ha expirado o no existe

    await userServices.sendEmailResetPassword(email, password);//Llama al servicio para restablecer la contraseña del usuario

    res
      .status(200)
      .json({ status: "success", response: "Password successfully updated" });//Responde con un mensaje de éxito si la contraseña fue actualizada correctamente
  } catch (error) {
    error.path = "[POST] /api/user/reset-password";
    next(error);
  }
};//Controlador para restablecer la contraseña

const changeUserRole = async (req, res, next) => {
  try {
    const { uid, role } = req.params;//Obtiene el ID y el role del usuario desde los parámetros de la URL
    const response = await userServices.changeUserRole(uid, role);//Llama al servicio para cambiar el rol del usuario
    res.status(200).json({ status: "success", response });//Responde con un mensaje de éxito si el rol fue actualizado correctamente
  } catch (error) {
    error.path = "[POST] /api/user/premium/:uid";
    next(error);
  }
};//Controlador para cambiar el rol del usuario

const addDocuments = async (req,res,next) =>{
  try {
    const { uid } = req.params;//Obtiene el user ID de los parámetros de la URL
    const files = req.files;
    const response = await userServices.addDocuments(uid, files );
    res.status(200).json({ status: "success", response });//Responde con un mensaje de éxito
  } catch (error) {
    error.path = "[POST] /api/user/:uid/documents";
    next(error);    
  }
};//Controlador para agregar documentos

const getUsers = async (req, res, next) => {
  try {
    const users = await userServices.getUsers();
    res.status(200).json({ status: "success", users });
  } catch (error) {
    error.path = "[GET] /api/user/";
    next(error);
  }
};//Controlador para acceder a todos los usuarios

const deleteInactiveUsers = async (req, res, next) => {
  try {
    const deletedUsers = await userServices.deleteInactiveUsers();//Eliminar usuarios inactivos
    

    for (const user of deletedUsers) {
      await emailServices.sendInactiveUserMail(user);//Llamada al servicio de correos para notificar eliminación
    }//Enviar correos a los usuarios eliminados
    

    res.status(200).json({
      status: "success",
      message: `${deletedUsers.length} users deleted due to inactivity`,
    });
  } catch (error) {
    error.path = "[DELETE] /api/user/";
    next(error);
  }
};//Controlador para eliminar todos los usuarios inactivos


export default {
  sendEmailResetPassword,
  resetPassword,
  changeUserRole,
  addDocuments,
  getUsers, 
  deleteInactiveUsers
};