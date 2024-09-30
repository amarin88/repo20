import ticketsRepository from "../persistences/mongo/repositories/tickets.repository.js";//Import de ticket repositories

const createTicket = async (userMail, totalCart) =>{
    const newTicket = {
        amount: totalCart,
        purchaser: userMail,
        code: Math.random().toString(36).substr(2, 9),

    }
    const createdTicket = await ticketsRepository.create(newTicket);
    return createdTicket;
};//Función asincronica que crea un ticket para el carrito

export default {
    createTicket,
};