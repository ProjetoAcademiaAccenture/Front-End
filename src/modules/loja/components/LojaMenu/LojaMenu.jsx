import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import "./LojaMenu.css";
import { ROUTES } from "../../../../constants";

export default function LojaMenu({ isAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout("loja");
    navigate(ROUTES.LOGIN_SHOP);
  };

  return (
    <nav className="loja-menu">
      <Link
        to="/loja/produtos"
        className={`menu-item ${isActive("/produtos") ? "active" : ""}`}
      >
        📦 Produtos
      </Link>

      <Link
        to="/loja/carrinho"
        className={`menu-item ${isActive("/carrinho") ? "active" : ""}`}
      >
        🛒 Carrinho
      </Link>

      <Link
        to="/loja/pedidos"
        className={`menu-item ${isActive("/pedidos") ? "active" : ""}`}
      >
        📋 Meus Pedidos
      </Link>

      {isAdmin && (
        <>
          <Link
            to="/loja/admin"
            className={`menu-item ${isActive("/admin") ? "active" : ""}`}
          >
            👨‍💼 Admin
          </Link>

          <Link
            to="/loja/estoque"
            className={`menu-item ${isActive("/estoque") ? "active" : ""}`}
          >
            📊 Estoque
          </Link>
        </>
      )}

      <Link
        to="/loja/perfil"
        className={`menu-item ${isActive("/perfil") ? "active" : ""}`}
      >
        👤 Perfil
      </Link>

      <button type="button" className="menu-item logout" onClick={handleLogout}>
        🚪 Sair
      </button>
    </nav>
  );
}
