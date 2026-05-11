import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";

import "./BancoMenu.css";

import {
  LayoutDashboard,
  List,
  Wallet,
  User,
} from 'lucide-react';

export default function BancoMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useModuleAuth("banco");

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout("banco");
    navigate(ROUTES.LOGIN_BANK);
  };

  return (
    <nav className="banco-menu">

      <Link
        to="/banco/dashboard"
        className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        to="/banco/transacoes"
        className={`menu-item ${isActive("/transacoes") ? "active" : ""}`}
      >
        <List size={18} />
        Transações
      </Link>

      <Link
        to="/banco/deposito"
        className={`menu-item ${isActive("/deposito") ? "active" : ""}`}
      >
        <Wallet size={18} />
        Depósito
      </Link>

      <Link
        to="/banco/perfil"
        className={`menu-item ${isActive("/perfil") ? "active" : ""}`}
      >
        <User size={18} />
        Perfil
      </Link>
      <button type="button" onClick={handleLogout} className="menu-item logout">
        🚪 Sair
      </button>
    </nav>
  );
}