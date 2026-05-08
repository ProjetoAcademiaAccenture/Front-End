import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { lojaAPI } from '../../services/lojaAPI';
import { Input } from '../../../../components/custom/input/input';
import './LojaLogin.css';


export default function LojaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resultado = await lojaAPI.login(email, senha);
      if (resultado.success) {
        login(resultado.user, 'loja');
        navigate('/loja/produtos');
      } else {
        setErro(resultado.error);
      }
    } catch (err) {
      setErro('Erro ao fazer login. Tente novamente.');
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
            <div className="form-group">
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

            <div className="form-group">
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
