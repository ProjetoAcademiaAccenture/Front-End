// Simulação de API da Loja
export const lojaAPI = {
  login: async (email, senha) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && senha) {
          resolve({
            success: true,
            user: {
              id: 1,
              email,
              nome: email.split('@')[0],
              tipo: email.includes('admin') ? 'admin' : 'cliente',
            },
          });
        } else {
          resolve({ success: false, error: 'Credenciais inválidas' });
        }
      }, 500);
    });
  },

  signup: async (nome, email, senha, confirmarSenha) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (senha === confirmarSenha && email && nome) {
          resolve({
            success: true,
            user: {
              id: Math.random(),
              email,
              nome,
              tipo: 'cliente',
            },
          });
        } else {
          resolve({ success: false, error: 'Dados inválidos' });
        }
      }, 500);
    });
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
};
