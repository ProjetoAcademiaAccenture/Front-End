import React, { useContext } from 'react';
import { useBanco } from '../../hooks/useBanco';
import { AuthContext } from '../../../../context/AuthContext';
import Extrato from '../../components/Extrato/Extrato';
import './BancoDashboard.css';

import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Shield,
} from 'lucide-react';

export default function BancoDashboard() {
  const { saldo, transacoes } = useBanco();
  const { user } = useContext(AuthContext);

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>
          <LayoutDashboard size={22} /> Dashboard
        </h1>
        <p className="page-subtitle">Visão geral da sua conta</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={20} />
          </div>
          <div className="stat-content">
            <h3>Saldo Total</h3>
            <p className="stat-value">
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <h3>Total de Transações</h3>
            <p className="stat-value">{transacoes.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <h3>Créditos</h3>
            <p className="stat-value credito">
              +R$ {transacoes
                .filter((t) => t.tipo === 'credito')
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingDown size={20} />
          </div>
          <div className="stat-content">
            <h3>Débitos</h3>
            <p className="stat-value debito">
              -R$ {transacoes
                .filter((t) => t.tipo === 'debito')
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <Extrato transacoes={transacoes} />

      <div className="info-cards">
        <div className="info-card">
          <h3>
            <ClipboardList size={18} /> Informações da Conta
          </h3>

          <div className="info-item">
            <span className="label">Nome:</span>
            <span className="value">{user?.nome}</span>
          </div>

          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user?.email}</span>
          </div>

          <div className="info-item">
            <span className="label">Conta:</span>
            <span className="value">{user?.conta}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>
            <Shield size={18} /> Segurança
          </h3>

          <button className="btn-secondary">Alterar Senha</button>
          <button className="btn-secondary">Ativar 2FA</button>
        </div>
      </div>
    </div>
  );
}