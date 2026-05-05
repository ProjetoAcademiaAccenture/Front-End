import React from 'react';
import './BancoHeader.css';

export default function BancoHeader({ saldo, usuarioNome }) {
  return (
    <header className="banco-header">
      <div>
        <h1 className="banco-title">🏦 Banco Digital</h1>
        {usuarioNome && <p className="banco-user">Bem-vindo, {usuarioNome}</p>}
      </div>
      <div className="banco-saldo-block">
        <span className="banco-saldo-label">Saldo disponível</span>
        <div className="banco-saldo">
          R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </header>
  );
}
