import api from "../../../services/api";

export const lojaAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (newUser) => {
    const response = await api.post("/auth/register", newUser);
    return response;
  },

  getProdutos: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, produtos: [] });
      }, 300);
    });
  },

  processarPagamento: async (valor) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.1,
          transacaoId: `TRX${Date.now()}`,
        });
      }, 1000);
    });
  },

  // Métodos de Boleto
  gerarBoleto: async (pedidoId) => {
    try {
      const response = await api.post(`/api/boletos/gerar/${pedidoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  buscarBoleto: async (boletoId) => {
    try {
      const response = await api.get(`/api/boletos/${boletoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  buscarBoletoPorPedido: async (pedidoId) => {
    try {
      const response = await api.get(`/api/boletos/pedido/${pedidoId}`);
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
