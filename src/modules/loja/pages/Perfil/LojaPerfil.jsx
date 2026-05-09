import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../auth/context/AuthContext';
import './LojaPerfil.css';

export default function LojaPerfil() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>👤 Perfil</h1>
        <p className="page-subtitle">Gerencie seus dados pessoais</p>
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
            <span className="info-label">Tipo de Conta:</span>
            <span className="info-value">
              {user?.tipo === 'admin' ? '👨‍💼 Administrador' : '👥 Cliente'}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="perfil-card">
          <h2>Endereço de Entrega</h2>

          <button className="btn-action">📍 Adicionar/Editar Endereço</button>
          <button className="btn-action">🗂️ Meus Endereços</button>
        </div>

        <div className="perfil-card">
          <h2>Preferências</h2>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span>Receber notificações de promoções</span>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span>Receber avisos de pedidos</span>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Newsletter semanal</span>
          </label>

          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span>Comunicações por email</span>
          </label>
        </div>

        {user?.tipo === 'admin' && (
          <div className="perfil-card admin">
            <h2>⚙️ Painel Administrativo</h2>
            <p>Você tem acesso às ferramentas administrativas da loja.</p>
            <button className="btn-action">📊 Dashboard Admin</button>
          </div>
        )}

        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair da Conta
          </button>

          <button className="btn-delete">⚠️ Deletar Conta</button>

          <p className="warning-text">
            Atenção: Deletar sua conta é permanente. Todos os dados serão removidos.
          </p>
        </div>
      </div>
    </div>
  );
}
