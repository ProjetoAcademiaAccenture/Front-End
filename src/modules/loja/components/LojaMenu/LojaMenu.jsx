import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LojaMenu.css';

export default function LojaMenu({ isAdmin }) {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="loja-menu">
      <Link
        to="/loja/produtos"
        className={`menu-item ${isActive('/produtos') ? 'active' : ''}`}
      >
        📦 Produtos
      </Link>
      <Link
        to="/loja/carrinho"
        className={`menu-item ${isActive('/carrinho') ? 'active' : ''}`}
      >
        🛒 Carrinho
      </Link>
      <Link
        to="/loja/pedidos"
        className={`menu-item ${isActive('/pedidos') ? 'active' : ''}`}
      >
        📋 Meus Pedidos
      </Link>
      {isAdmin && (
        <>
          <Link
            to="/loja/admin"
            className={`menu-item ${isActive('/admin') ? 'active' : ''}`}
          >
            👨‍💼 Admin
          </Link>
          <Link
            to="/loja/estoque"
            className={`menu-item ${isActive('/estoque') ? 'active' : ''}`}
          >
            📊 Estoque
          </Link>
        </>
      )}
      <Link
        to="/loja/perfil"
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
