import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BancoMenu.css';

import {
  LayoutDashboard,
  List,
  Wallet,
  User,
  LogOut,
} from 'lucide-react';

export default function BancoMenu() {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="banco-menu">

      <Link
        to="/banco/dashboard"
        className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        to="/banco/transacoes"
        className={`menu-item ${isActive('/transacoes') ? 'active' : ''}`}
      >
        <List size={18} />
        Transações
      </Link>

      <Link
        to="/banco/deposito"
        className={`menu-item ${isActive('/deposito') ? 'active' : ''}`}
      >
        <Wallet size={18} />
        Depósito
      </Link>

      <Link
        to="/banco/perfil"
        className={`menu-item ${isActive('/perfil') ? 'active' : ''}`}
      >
        <User size={18} />
        Perfil
      </Link>

      <Link
        to="/"
        className="menu-item logout"
      >
        <LogOut size={18} />
        Sair
      </Link>

    </nav>
  );
}