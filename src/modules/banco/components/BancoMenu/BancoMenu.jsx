import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BancoMenu.css';

export default function BancoMenu() {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="banco-menu">
      <Link
        to="/banco/dashboard"
        className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}
      >
        📊 Dashboard
      </Link>
      <Link
        to="/banco/transacoes"
        className={`menu-item ${isActive('/transacoes') ? 'active' : ''}`}
      >
        📋 Transações
      </Link>
      <Link
        to="/banco/deposito"
        className={`menu-item ${isActive('/deposito') ? 'active' : ''}`}
      >
        💰 Depósito
      </Link>
      <Link
        to="/banco/perfil"
        className={`menu-item ${isActive('/perfil') ? 'active' : ''}`}
      >
        👤 Perfil
      </Link>
      <Link
        to="/"
        className="menu-item logout"
      >
        🚪 Sair
      </Link>
    </nav>
  );
}
