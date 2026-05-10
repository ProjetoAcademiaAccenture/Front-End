import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import './BancoPerfil.css';

import {
  User,
  Mail,
  CreditCard,
  Shield,
  KeyRound,
  Smartphone,
  Bell,
  LogOut,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

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
        <h1>
          <User size={22} /> Perfil
        </h1>
        <p className="page-subtitle">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="perfil-container">

        {/* INFORMAÇÕES */}
        <div className="perfil-card">
          <h2>Informações Pessoais</h2>

          <div className="info-row">
            <div className="info-left">
              <Mail size={16} />
              <span className="info-label">Email:</span>
            </div>
            <span className="info-value">{user?.email}</span>
          </div>

          <div className="info-row">
            <div className="info-left">
              <CreditCard size={16} />
              <span className="info-label">Conta:</span>
            </div>
            <span className="info-value">{user?.conta}</span>
          </div>

          <div className="info-row">
            <div className="info-left">
              <User size={16} />
              <span className="info-label">Nome:</span>
            </div>
            <span className="info-value">{user?.nome}</span>
          </div>

          <div className="info-row">
            <div className="info-left">
              <Shield size={16} />
              <span className="info-label">Tipo:</span>
            </div>
            <span className="info-value">Pessoa Física</span>
          </div>

          <div className="info-row">
            <div className="info-left">
              <KeyRound size={16} />
              <span className="info-label">CPF:</span>
            </div>
            <span className="info-value">•••.•••.•••-••</span>
          </div>
        </div>

        {/* SEGURANÇA */}
        <div className="perfil-card">
          <h2>Configurações de Segurança</h2>

          <button className="btn-action">
            <KeyRound size={16} /> Alterar Senha
          </button>

          <button className="btn-action">
            <Smartphone size={16} /> Autenticação de Dois Fatores
          </button>

          <button className="btn-action">
            <Bell size={16} /> Notificações de Segurança
          </button>
        </div>

        {/* ZONA DE PERIGO */}
        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sair da Conta
          </button>

          <button className="btn-delete">
            <Trash2 size={16} /> Deletar Conta
          </button>

          <p className="warning-text">
            <AlertTriangle size={16} /> Atenção: Deletar sua conta é permanente e não pode ser revertido.
          </p>
        </div>

      </div>
    </div>
  );
}