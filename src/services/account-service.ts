import getApiInstance from './api-client';
import { Conta, Transacao, StatementFilter } from '../types';

export const accountService = {
  getById: async (id: number): Promise<Conta> => {
    const response = await getApiInstance().get(`/api/contas/${id}`);
    return response.data;
  },

  deposit: async (id: number, valor: number): Promise<Conta> => {
    const response = await getApiInstance().patch(`/api/contas/${id}/depositar?valor=${valor}`);
    return response.data;
  },

  getStatement: async (id: number, filters?: StatementFilter): Promise<Transacao[]> => {
    const params = new URLSearchParams();
    if (filters?.inicio) params.append('inicio', filters.inicio);
    if (filters?.fim) params.append('fim', filters.fim);
    if (filters?.tipo) params.append('tipo', filters.tipo);

    const response = await getApiInstance().get(`/api/contas/${id}/extrato?${params.toString()}`);
    return response.data;
  },
};
