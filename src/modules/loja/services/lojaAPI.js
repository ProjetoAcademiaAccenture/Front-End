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

    getPedidos: async (clienteId) => {
      const response = await lojaApi.get(`/api/pedidos/cliente/${clienteId}`);
      return response.data;
    },

    cancelarPedido: async (pedidoId) => {
      const response = await lojaApi.patch(`/api/pedidos/${pedidoId}/cancelar`);
      return response;
    },

    getPedidoPorId: async (pedidoId) => {
      const response = await lojaApi.get(`/api/pedidos/${pedidoId}`);
      return response.data;
    },

    getBoletoPorPagamentoId: async (pagamentoId) => {
      const response = await lojaApi.get(`/api/boletos/pagamento/${pagamentoId}`);
      return response;
    },

    pagarBoleto: async (boletoId, senhaTransacao) => {
      const response = await lojaApi.post(`/api/boletos/${boletoId}/pagar`, {
        senhaTransacao,
      });
      return response.data;
    },

    processarPagamento: async (payload) => {
      const response = await lojaApi.post("/api/pagamentos/processar", payload);
      return response;
    },

    ajustarEstoque: async (id, novaQuantidade) => {
      const response = await lojaApi.patch(`/api/produtos/${id}/estoque`, null, {
        params: { novaQuantidade },
      });
      return response.data;
    },

    criarProduto: async (dto) => {
      const response = await lojaApi.post("/api/produtos", dto);
      return response.data;
    },

    atualizarProduto: async (id, dto) => {
      const response = await lojaApi.put(`/api/produtos/${id}`, dto);
      return response.data;
    },

    deletarProduto: async (id) => {
      await lojaApi.delete(`/api/produtos/${id}`);
    },

    getPedidosTodos: async () => {
      const response = await lojaApi.get("/api/pedidos");
      return response.data;
    },


    getEnderecos: async (clienteId) => {
      const response = await lojaApi.get(`/api/clientes/${clienteId}/enderecos`);
      return response.data;
    },

    getEnderecoPorId: async (clienteId, enderecoId) => {
      const response = await lojaApi.get(`/api/clientes/${clienteId}/enderecos/${enderecoId}`);
      return response.data;
    },

    adicionarEndereco: async (clienteId, dto) => {
      const response = await lojaApi.post(`/api/clientes/${clienteId}/enderecos`, dto);
      return response;
    },

    removerEndereco: async (clienteId, enderecoId) => {
      await lojaApi.delete(`/api/clientes/${clienteId}/enderecos/${enderecoId}`);
    },
    atualizarEndereco: async (clienteId, enderecoId, dto) => {
      const response = await lojaApi.put(`/api/clientes/${clienteId}/enderecos/${enderecoId}`, dto);
      return response.data;
    },

    deletarCliente: async (clienteId) => {
      await lojaApi.delete(`/api/clientes/${clienteId}`);
    },
  };