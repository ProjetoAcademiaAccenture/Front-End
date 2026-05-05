import React from 'react';
import './LojaHeader.css';

export default function LojaHeader({ usuarioNome, carrinhoQuantidade }) {
  return (
    <header className="loja-header">
      <div>
        <h1 className="loja-title">🛍️ Loja Online</h1>
        {usuarioNome && <p className="loja-user">Bem-vindo, {usuarioNome}</p>}
      </div>
      {carrinhoQuantidade > 0 && (
        <div className="carrinho-badge">
          🛒 {carrinhoQuantidade} item{carrinhoQuantidade !== 1 ? 's' : ''}
        </div>
      )}
    </header>
  );
}
