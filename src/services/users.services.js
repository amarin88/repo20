import { userResponseDto } from "../dto/userResponse.dto.js";//Import de dto de users
import customErrors from "../errors/customErrors.js";//Import de errores
import usersRepository from "../persistences/mongo/repositories/users.repository.js";//Import del repositorio de users
import { createHash, isValidPassword } from "../utils/hashPassword.js";//Import de funciones para manejar el hash de contraseñas
import { sendMail } from "../utils/sendMails.js";//Import de función para enviar correos electrónicos
import moment from "moment";//Import de moment

const sendEmailResetPassword = async (email) => {
  const message =
    "Must reset your password at the following link: https://www.google.com";//Mensaje que contiene el enlace para restablecer la contraseña
  await sendMail(email, "Reset Password", message);//LLama a la función para enviar el correo con el asunto "Reset Password" y el mensaje

  return "Email sent";//Retorna un mensaje indicando que el correo fue enviado
};//Función para enviar el correo de restablecimiento de contraseña

const resetPassword = async (email, password) => {
  const user = usersRepository.getByEmail(email);//Busca al usuario en la base de datos por su correo electrónico
  if (!user) throw customErrors.notFoundError("User not found");//Lanza un error si no se encuentra el usuario

  const samePassword = isValidPassword(user, password);
  if (samePassword) throw customErrors.badRequestError("Password already used");//Lanza un error si la contraseña ya ha sido usada

  return await usersRepository.update(user._id, {
    password: createHash(password),
  });//Actualiza la contraseña del usuario con la nueva, usando hash
};//Función para restablecer la contraseña del usuario

const changeUserRole = async (uid) => {
  
  const user = await usersRepository.getById(uid);//Busca al usuario en la base de datos por su ID
  if (!user) throw customErrors.notFoundError("User not found");//Lanza un error si no se encuentra el usuario

  if(user.role === "user" && user.documents.length < 3) throw customErrors.badRequestError("You must include all documentation");//Lanza error si no se han cargado los 3 documentos
  
  const userRole = user.role === "premium" ? "user" : "premium";//Cambia el rol del usuario, si es "premium" lo pasa a "user" y viceversa

  return await usersRepository.update(uid, { role: userRole });//Actualiza el rol del usuario en la base de datos
};//Función para cambiar el rol del usuario

const addDocuments = async (uid, reqFiles) => {
  const files = reqFiles.document;

  const newDocuments = files.map(file => ({
    name: file.filename,
    reference: file.path
  }));

  const user = await usersRepository.getById(uid);//Obtiene el usuario actual con sus documentos existentes
  const currentDocuments = user.documents || [];

  const updatedDocuments = [...currentDocuments, ...newDocuments];//Agrega los nuevos documentos a los existentes

  const updatedUser = await usersRepository.update(uid, { documents: updatedDocuments });//Actualiza el usuario con todos los documentos

  return updatedUser;
};//Función para agregar documentos

const getUsers = async () => {
  const users = await usersRepository.getAll(); // Obtiene todos los usuarios
  return users.map(user => userResponseDto(user)); // Aplicamos el DTO para cada usuario
};

const deleteInactiveUsers = async () => {
  const thresholdDate = moment().subtract(30, 'minutes');//Usamos 30 minutos para pruebas
  const inactiveUsers = await usersRepository.getAll();
  const usersToDelete = inactiveUsers.filter(user => moment(user.last_connection).isBefore(thresholdDate));// Encontrar usuarios inactivos basados en `last_connection`

  const deletedUsers = [];//Eliminar cada usuario inactivo y enviar correos
  for (const user of usersToDelete) {
    const success = await usersRepository.deleteOne(user._id);
    if (success) {
      deletedUsers.push(user);//Si se elimina, se agrega a la lista
      
      await sendMail(user.email, 'Account deleted due to inactivity', `Hello ${user.first_name}, your account has been deleted due to inactivity.`);
    }//Enviar correo de notificación
  }

  return deletedUsers;//Devuelve los usuarios eliminados
};

export default {
  sendEmailResetPassword,
  resetPassword,
  changeUserRole,
  addDocuments,
  getUsers, 
  deleteInactiveUsers
};