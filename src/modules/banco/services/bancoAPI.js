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

  getTransacoes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transacoes: [],
        });
      }, 300);
    });
  },

  // Métodos de Boleto
  buscarBoleto: async (boletoId) => {
    try {
      const response = await api.get(`/api/boletos/${boletoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  pagarBoleto: async (boletoId) => {
    try {
      const response = await api.patch(`/api/boletos/${boletoId}/pagar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelarBoleto: async (boletoId) => {
    try {
      const response = await api.patch(`/api/boletos/${boletoId}/cancelar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
