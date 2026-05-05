import React from 'react';
import { useBanco } from '../../hooks/useBanco';
import Extrato from '../../components/Extrato/Extrato';
import './BancoTransacoes.css';

export default function BancoTransacoes() {
  const { transacoes } = useBanco();

  const transacoesCreditadas = transacoes.filter((t) => t.tipo === 'credito');
  const transacoesBitacas = transacoes.filter((t) => t.tipo === 'debito');

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>📋 Transações</h1>
        <p className="page-subtitle">Histórico completo de movimentações</p>
      </div>

      <div className="transacoes-container">
        <Extrato transacoes={transacoes} />

        <div className="transacoes-stats">
          <div className="stat-box">
            <h3>Créditos</h3>
            <p className="valor credito">
              +R$ {transacoesCreditadas
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="quantidade">{transacoesCreditadas.length} transações</p>
          </div>

          <div className="stat-box">
            <h3>Débitos</h3>
            <p className="valor debito">
              -R$ {transacoesBitacas
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="quantidade">{transacoesBitacas.length} transações</p>
          </div>

          <div className="stat-box">
            <h3>Total de Transações</h3>
            <p className="valor">{transacoes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
