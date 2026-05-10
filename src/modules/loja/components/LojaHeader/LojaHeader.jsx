import React from 'react';
import './LojaHeader.css';
import { ShoppingCart } from 'lucide-react';

export default function LojaHeader({ usuarioNome, carrinhoQuantidade }) {
  return (
    <header className="loja-header">
      <div>
        <h1 className="loja-title">🛍️ Loja Online</h1>
        {usuarioNome && <p className="loja-user">Bem-vindo, {usuarioNome}</p>}
      </div>
      {carrinhoQuantidade > 0 && (
        <div className="carrinho-badge">
          <ShoppingCart style={{ marginRight: '10px' }} />
          {carrinhoQuantidade} item{carrinhoQuantidade !== 1 ? 's' : ''}
        </div>
      )}
    </header>
  );
}
