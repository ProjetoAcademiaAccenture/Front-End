import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../auth/context/AuthContext';
import { bancoAPI } from '../../services/bancoAPI';
import { Input } from '../../../../components/custom/input/input';
import './BancoCadastro.css';

export default function BancoCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem');
      setCarregando(false);
      return;
    }

    try {
      const resultado = await bancoAPI.signup(nome, email, senha, confirmarSenha);
      if (resultado.success) {
        setSucesso('Cadastro realizado com sucesso!');
        signup(resultado.user, 'banco');
        setTimeout(() => {
          navigate('/banco/dashboard');
        }, 1500);
      } else {
        setErro(resultado.error);
      }
    } catch (err) {
      setErro('Erro ao fazer cadastro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="banco-auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>🏦 Banco Digital</h1>
          <h2>Cadastro</h2>

          {erro && <div className="error-message">{erro}</div>}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
                disabled={carregando}
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <Input
                id="confirmarSenha"
                isPassword
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
                disabled={carregando}
              />
            </div>

            <button type="submit" className="btn-cadastro" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Já tem conta? <a href="/banco/login">Faça login aqui</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
