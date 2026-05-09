import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";

import "./BancoMenu.css";

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
        📊 Dashboard
      </Link>
      <Link
        to="/banco/transacoes"
        className={`menu-item ${isActive("/transacoes") ? "active" : ""}`}
      >
        📋 Transações
      </Link>
      <Link
        to="/banco/deposito"
        className={`menu-item ${isActive("/deposito") ? "active" : ""}`}
      >
        💰 Depósito
      </Link>
      <Link
        to="/banco/perfil"
        className={`menu-item ${isActive("/perfil") ? "active" : ""}`}
      >
        👤 Perfil
      </Link>
      <button type="button" onClick={handleLogout} className="menu-item logout">
        🚪 Sair
      </button>
    </nav>
  );
}
