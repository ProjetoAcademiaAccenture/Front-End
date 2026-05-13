import { lojaApi } from "../../../services/api";

export const lojaAPI = {
  login: async (credentials) => {
    const response = await lojaApi.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (newUser) => {
    const response = await lojaApi.post("/auth/register", newUser);
    return response;
  },

  getProdutos: async () => {
    const response = await lojaApi.get("/api/produtos");
    return response.data;
  },

  getProdutoByCategoria: async (categoria) => {
    const response = await lojaApi.get(`api/produtos/categoria/${categoria}`);
    return response.data;
  },

  finalizarPedido: async (pedido) => {
    const response = await lojaApi.post("/api/pedidos", pedido);
    return response;
  },
};
