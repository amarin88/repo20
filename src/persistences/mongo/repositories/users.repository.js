import { userModel } from "../models/user.model.js";//Import del user model

const getAll = async () =>{
    const users = await userModel.find();
    return users;
};//Función asincrona para traer todos los users

const getById = async ( id ) =>{
    const user = await userModel.findById(id);
    return user;
};//Función asincrona que recibe un id, busca el user que contenga ese id y lo retorna

const getByEmail = async (email ) => {
    const user = await userModel.findOne( { email });
    return user;
};//Función asincrona que recibe un email, busca el user que contenga ese email y lo retorna

const create = async (data) =>{
    const user = await userModel.create(data);
    return user;
};//Función asincrona que recibe la data que contendrá el usero y devuelve el user creado

const update = async (id, data) =>{
    const user = await userModel.findByIdAndUpdate(id, data, {new: true});
    return user;
};//Función asincrona que recibe el id del user y la data con la cual se actualizará el user, una vez actualizado busca el user por id y lo retorna

const deleteOne = async ( id ) =>{
    const user = await userModel.deleteOne({ _id: id }); //EL id tiene que coincidir con el de la base de datos de mongo
    if (user.deletedCount === 0) return false;
    return true;
};//Función asincrona que elimina el user por id

const deleteInactive = async (thresholdDate) => {
    const deletedUsers = await userModel.find({ last_connection: { $lt: thresholdDate } });
    await userModel.deleteMany({ last_connection: { $lt: thresholdDate } }); // Elimina los usuarios inactivos
    return deletedUsers; // Devuelve los usuarios eliminados
  };

export default { getAll, getById, getByEmail, create, update, deleteOne, deleteInactive };//Export de todas las funciones