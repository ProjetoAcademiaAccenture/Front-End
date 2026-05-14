import { bancoApi } from "../../../services/api";

export const bancoAPI = {
  login: async (credentials) => {
    const response = await bancoApi.post("/auth/login-bank", credentials);
    return response.data;
  },

  signup: async (newAccountData) => {
    const response = await bancoApi.post("/auth/register-bank", newAccountData);
    return response;
  },

  getConta: async (contaId) => {
    const response = await api.get(`/api/contas/${contaId}`);
    return response.data;
  },

  getExtrato: async (contaId, params = {}) => {
    const response = await api.get(`/api/contas/${contaId}/extrato`, { params });
    return response.data;
  },

  depositar: async (contaId, valor) => {
    const response = await api.patch(`/api/contas/${contaId}/depositar`, null, {
      params: { valor },
    });
    return response.data;
  },

  getBoleto: async (boletoId) => {
    const response = await api.get(`/api/boletos/${boletoId}`);
    return response.data;
  },

  pagarBoleto: async (boletoId) => {
    const response = await api.patch(`/api/boletos/${boletoId}/pagar`);
    return response.data;
  },

  transferir: async (contaId, dados) => {
    const response = await api.post(`/api/contas/${contaId}/transferir`, dados);
    return response.data;
  },
};