import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <h1>🏪 Sistema de E-Commerce</h1>
        <p className="subtitle">Escolha um módulo para começar</p>

        <div className="modules-grid">
          <Link to="/banco" className="module-card banco">
            <div className="module-icon">🏦</div>
            <h2>Banco Digital</h2>
            <p>Gerencie suas transações, depósitos e saldo</p>
            <ul className="module-features">
              <li>✓ Login e Cadastro</li>
              <li>✓ Extrato de Transações</li>
              <li>✓ Depósitos</li>
              <li>✓ Dashboard com Saldo</li>
            </ul>
          </Link>

          <Link to="/loja" className="module-card loja">
            <div className="module-icon">🛍️</div>
            <h2>Loja Online</h2>
            <p>Compre produtos, gerencie estoque e pedidos</p>
            <ul className="module-features">
              <li>✓ Catálogo de Produtos</li>
              <li>✓ Carrinho de Compras</li>
              <li>✓ Checkout Seguro</li>
              <li>✓ Painel Administrativo</li>
            </ul>
          </Link>
        </div>

        <div className="info-section">
          <h3>Como Funciona?</h3>
          <div className="info-grid">
            <div className="info-card">
              <span className="info-number">1</span>
              <h4>Cadastre-se</h4>
              <p>Crie uma conta no Banco ou na Loja</p>
            </div>
            <div className="info-card">
              <span className="info-number">2</span>
              <h4>Deposite Fundos</h4>
              <p>Faça um depósito no Banco Digital</p>
            </div>
            <div className="info-card">
              <span className="info-number">3</span>
              <h4>Compre Produtos</h4>
              <p>Navegue pela Loja e adicione produtos</p>
            </div>
            <div className="info-card">
              <span className="info-number">4</span>
              <h4>Finalize Compras</h4>
              <p>Use seu saldo do Banco para pagar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
