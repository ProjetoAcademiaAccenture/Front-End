import api from "../../../services/api";

export const bancoAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login-bank", credentials);
    return response.data;
  },

  signup: async (newAccountData) => {
    const response = await api.post("/auth/register-bank", newAccountData);
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
};
