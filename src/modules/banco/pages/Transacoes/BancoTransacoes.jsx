import React from 'react';
import { useBanco } from '../../hooks/useBanco';
import Extrato from '../../components/Extrato/Extrato';
import './BancoTransacoes.css';

import {
  List,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

export default function BancoTransacoes() {
  const { transacoes } = useBanco();

  const transacoesCreditadas = transacoes.filter(
    (t) => t.tipo === 'CREDITO' || t.tipo === 'ESTORNO'
  );

  const transacoesDebito = transacoes.filter(
    (t) => t.tipo === 'DEBITO' || t.tipo === 'MULTA'
  );

  return (
    <div className="banco-page">
      <div className="page-header">
        <h1>
          <List size={22} /> Transações
        </h1>
        <p className="page-subtitle">
          Histórico completo de movimentações
        </p>
      </div>

      <div className="transacoes-container">
        <Extrato transacoes={transacoes} />

        <div className="transacoes-stats">

          <div className="stat-box">
            <h3>
              <TrendingUp size={18} /> Créditos
            </h3>
            <p className="valor credito">
              +R$ {transacoesCreditadas
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="quantidade">
              {transacoesCreditadas.length} transações
            </p>
          </div>

          <div className="stat-box">
            <h3>
              <TrendingDown size={18} /> Débitos
            </h3>
            <p className="valor debito">
              -R$ {transacoesDebito
                .reduce((sum, t) => sum + t.valor, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="quantidade">
              {transacoesDebito.length} transações
            </p>
          </div>

          <div className="stat-box">
            <h3>
              <Activity size={18} /> Total de Transações
            </h3>
            <p className="valor">
              {transacoes.length}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
