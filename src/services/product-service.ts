import getApiInstance from './api-client';
import { Produto } from '../types';

export const productService = {
  list: async (): Promise<Produto[]> => {
    const response = await getApiInstance().get('/api/produtos');
    return response.data;
  },

  getById: async (id: number): Promise<Produto> => {
    const response = await getApiInstance().get(`/api/produtos/${id}`);
    return response.data;
  },

  create: async (data: Omit<Produto, 'id'>): Promise<Produto> => {
    const response = await getApiInstance().post('/api/produtos', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Produto>): Promise<Produto> => {
    const response = await getApiInstance().put(`/api/produtos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await getApiInstance().delete(`/api/produtos/${id}`);
  },

  adjustStock: async (id: number, novaQuantidade: number): Promise<Produto> => {
    const response = await getApiInstance().patch(`/api/produtos/${id}/estoque?novaQuantidade=${novaQuantidade}`);
    return response.data;
  },
};
