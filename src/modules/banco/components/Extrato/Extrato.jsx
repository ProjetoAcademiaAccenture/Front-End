import React from 'react';
import './Extrato.css';
import { FileText } from 'lucide-react';

const TIPO_LABEL = {
  CREDITO: 'credito',
  DEBITO: 'debito',
  ESTORNO: 'credito',  // estorno é positivo visualmente
  MULTA: 'debito',
};

const TIPO_PREFIXO = {
  CREDITO: '+',
  DEBITO: '-',
  ESTORNO: '+',
  MULTA: '-',
};

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
          {transacoes.map((transacao) => {
            const tipoNorm = transacao.tipo?.toUpperCase();
            const cssClass = TIPO_LABEL[tipoNorm] ?? 'debito';
            const prefixo = TIPO_PREFIXO[tipoNorm] ?? '-';

            return (
              <div key={transacao.id} className="extrato-row">
                <div className="extrato-info">
                  <div className="extrato-desc">
                    {transacao.descricao}
                  </div>
                  <div className="extrato-date">
                    {transacao.data}
                  </div>
                </div>

                <div className={`extrato-valor ${cssClass}`}>
                  {prefixo}R$ {transacao.valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
