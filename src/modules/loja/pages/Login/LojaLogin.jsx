import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lojaAPI } from '../../services/lojaAPI';
import { Input } from '../../../../components/custom/input/input';
import { ROUTES } from '../../../../constants';
import { useModuleAuth } from '../../../../auth/hooks/useModuleAuth';

import './LojaLogin.css';

export default function LojaLogin() {
  const { login } = useModuleAuth("loja");
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resultado = await lojaAPI.login({ email, senha });

      if (resultado?.token) {
        const userData = {
          clienteId: resultado.clienteId,
          nome: resultado.nome,
          tipoCliente: resultado.tipoCliente,
        };

        login("loja", userData, resultado.token);
        navigate(ROUTES.PRODUCTS);
      } else {
        setErro("Credenciais inválidas.");
      }
    } catch (err) {
      setErro( err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="loja-auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>🛍️ Loja Online</h1>
          <h2>Login</h2>

          {erro && <div className="error-message">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-fullwidth">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={carregando}
              />
            </div>

            <div className="form-group-fullwidth">
              <label htmlFor="senha">Senha</label>
              <Input
                id="senha"
                isPassword
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                disabled={carregando}
              />
            </div>

            <button type="submit" className="btn-login" disabled={carregando}>
              {carregando ? 'Conectando...' : 'Entrar'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Não tem conta? <a href="/loja/signup">Crie uma aqui</a></p>
          </div>

          <div className="demo-info">
            <p>💡 Demo: Use qualquer email e senha (admin@email.com para acesso total)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
