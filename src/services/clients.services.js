import ClientsRepository from "../repositories/clients.repository.js";
import { CantDeleteEntity, EntityAlreadyExists, EntityContactAlreadyExists, EntityNotFound, IncompleteValues } from "../utils/custom-exceptions.js";

const clientRepository = new ClientsRepository();

const getClientsService = async () => {
    return await clientRepository.getClientsRepository();
}

const getClientByIdService = async (cid) => {
    const client = await clientRepository.getClientByIdRepository(cid);
    
    if (!client) throw new EntityNotFound("Client not found");
    
    return client;
}

const getClientByPhoneService = async (phone) => {
    const client = await clientRepository.getClientByPhoneRepository(phone);
    
    if (!client) throw new EntityNotFound("Client not found");
    
    return client;
}

const createClientService = async (client) => {
    const existingClient = await clientRepository.getClientByPhoneRepository(client.phone);
    
    if (existingClient) throw new EntityAlreadyExists("Client already exists");
    if (!client.name || !client.lastName || !client.phone || !client.address) throw new IncompleteValues("The client has not provided all the required values");
    
    return await clientRepository.saveClientRepository(client);
}

const updateClientService = async (cid, client) => {
    const existingClient = await clientRepository.getClientByIdRepository(cid);
    
    if (!existingClient) throw new EntityNotFound("Client not found");
    if (existingClient.phone === client.phone) throw new EntityContactAlreadyExists("The phone number has already been taken");

    const updateClient = { ...existingClient, ...client };

    return await clientRepository.updateClientRepository(cid, updateClient);
}

const deleteClientService = async (cid) => {
    const client = await clientRepository.getClientByIdRepository(cid);
    
    if (!client) throw new EntityNotFound("Client not found");

    for (const job of client.jobs) {
        if (job.budgetAccepted === true && job.isFinished === false) throw new CantDeleteEntity("The client has jobs that aren't finished and budgets that are accepted");
    }

    return await clientRepository.deleteClientRepository(cid);
}


export {
    getClientsService,
    getClientByIdService,
    getClientByPhoneService,
    createClientService,
    updateClientService,
    deleteClientService
}