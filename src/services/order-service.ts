import getApiInstance from './api-client';
import { Pedido } from '../types';

export const orderService = {
  list: async (): Promise<Pedido[]> => {
    const response = await getApiInstance().get('/api/pedidos');
    return response.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const response = await getApiInstance().get(`/api/pedidos/${id}`);
    return response.data;
  },

  getByClient: async (clienteId: number): Promise<Pedido[]> => {
    const response = await getApiInstance().get(`/api/pedidos/cliente/${clienteId}`);
    return response.data;
  },

  create: async (data: Omit<Pedido, 'id' | 'status'>): Promise<Pedido> => {
    const response = await getApiInstance().post('/api/pedidos', data);
    return response.data;
  },

  reserve: async (id: number): Promise<Pedido> => {
    const response = await getApiInstance().patch(`/api/pedidos/${id}/reservar`);
    return response.data;
  },

  pay: async (id: number): Promise<Pedido> => {
    const response = await getApiInstance().patch(`/api/pedidos/${id}/pagar`);
    return response.data;
  },

  cancel: async (id: number): Promise<Pedido> => {
    const response = await getApiInstance().patch(`/api/pedidos/${id}/cancelar`);
    return response.data;
  },
};
