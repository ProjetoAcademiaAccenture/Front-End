import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../auth/context/AuthContext';
import './BancoPerfil.css';

export default function BancoPerfil() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>👤 Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações pessoais</p>
      </div>

      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Informações Pessoais</h2>

          <div className="info-row">
            <span className="info-label">Nome:</span>
            <span className="info-value">{user?.nome}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Conta:</span>
            <span className="info-value">{user?.conta}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Tipo:</span>
            <span className="info-value">Pessoa Física</span>
          </div>

          <div className="info-row">
            <span className="info-label">CPF:</span>
            <span className="info-value">•••.•••.•••-••</span>
          </div>

          <div className="info-row">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="perfil-card">
          <h2>Configurações de Segurança</h2>

          <button className="btn-action">🔐 Alterar Senha</button>
          <button className="btn-action">📱 Autenticação de Dois Fatores</button>
          <button className="btn-action">🔔 Notificações de Segurança</button>

          <div className="divider"></div>

          <h2 style={{ marginTop: '30px' }}>Preferências</h2>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span>Receber notificações de transações</span>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span>Receber ofertas e promoções</span>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Newsletter semanal</span>
          </label>
        </div>

        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair da Conta
          </button>

          <button className="btn-delete">⚠️ Deletar Conta</button>

          <p className="warning-text">
            Atenção: Deletar sua conta é permanente e não pode ser revertido.
          </p>
        </div>
      </div>
    </div>
  );
}
