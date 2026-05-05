// Simulação de API do Banco
export const bancoAPI = {
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
              conta: '12345-6',
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
              conta: `${String(Math.random()).slice(2, 7)}-${String(Math.random()).slice(2, 3)}`,
            },
          });
        } else {
          resolve({ success: false, error: 'Dados inválidos' });
        }
      }, 500);
    });
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
};
