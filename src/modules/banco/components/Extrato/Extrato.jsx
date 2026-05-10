import React from 'react';
import './Extrato.css';

import { FileText } from 'lucide-react';

export default function Extrato({ transacoes }) {
  return (
    <div className="extrato-container">
      
      <h3 className="extrato-title">
        <FileText size={18} />
        Extrato
      </h3>

      {transacoes.length === 0 ? (
        <div className="extrato-empty">
          Nenhuma transação registrada
        </div>
      ) : (
        <div className="extrato-list">
          {transacoes.map((transacao) => (
            <div key={transacao.id} className="extrato-row">

              <div className="extrato-info">
                <div className="extrato-desc">
                  {transacao.descricao}
                </div>

                <div className="extrato-date">
                  {transacao.data}
                </div>
              </div>

              <div className={`extrato-valor ${transacao.tipo}`}>
                {transacao.tipo === 'credito' ? '+' : '-'}
                R$ {transacao.valor.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2
                })}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}