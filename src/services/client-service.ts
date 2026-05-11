import getApiInstance from './api-client';
import { Cliente, Endereco } from '../types';

export const clientService = {
  list: async (): Promise<Cliente[]> => {
    const response = await getApiInstance().get('/api/clientes');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await getApiInstance().get(`/api/clientes/${id}`);
    return response.data;
  },

  getByCPF: async (cpf: string): Promise<Cliente> => {
    const response = await getApiInstance().get(`/api/clientes/cpf/${cpf}`);
    return response.data;
  },

  update: async (id: number, data: Partial<Cliente>): Promise<Cliente> => {
    const response = await getApiInstance().put(`/api/clientes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await getApiInstance().delete(`/api/clientes/${id}`);
  },

  addAddress: async (id: number, endereco: Endereco): Promise<Endereco> => {
    const response = await getApiInstance().post(`/api/clientes/${id}/enderecos`, endereco);
    return response.data;
  },

  removeAddress: async (clienteId: number, enderecoId: number): Promise<void> => {
    await getApiInstance().delete(`/api/clientes/${clienteId}/enderecos/${enderecoId}`);
  },
};
