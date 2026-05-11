import getApiInstance from './api-client';
import { Boleto } from '../types';

export const invoiceService = {
  getById: async (id: number): Promise<Boleto> => {
    const response = await getApiInstance().get(`/api/boletos/${id}`);
    return response.data;
  },

  getByOrder: async (pedidoId: number): Promise<Boleto> => {
    const response = await getApiInstance().get(`/api/boletos/pedido/${pedidoId}`);
    return response.data;
  },

  generate: async (pedidoId: number): Promise<Boleto> => {
    const response = await getApiInstance().post(`/api/boletos/gerar/${pedidoId}`);
    return response.data;
  },

  pay: async (id: number): Promise<Boleto> => {
    const response = await getApiInstance().patch(`/api/boletos/${id}/pagar`);
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await getApiInstance().patch(`/api/boletos/${id}/cancelar`);
  },
};
