import { useContext } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { AuthContext } from "../../../../auth/context/AuthContext";

import {
  User,
  ShelvingUnit,
  PackageOpen,
  ShoppingCart,
  ReceiptText,
  UserStar,
} from "lucide-react";

import "./LojaMenu.css";

export default function LojaMenu({ isAdmin }) {
  const { saveLastPath } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useModuleAuth("loja");
  
  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout("loja");
    saveLastPath("loja", ROUTES.LOGIN_SHOP);
    navigate(ROUTES.LOGIN_SHOP);
  };

  const handleSavePath = (path) => () => {
    saveLastPath("loja", path);
  };

  return (
    <nav className="loja-menu">
      {/* --- VISÃO DO CLIENTE (Não Admin) --- */}
      {!isAdmin && (
        <>
          <Link
            to="/loja/produtos"
            className={`menu-item ${isActive("/produtos") ? "active" : ""}`}
          >
            <PackageOpen /> Produtos
          </Link>

          <Link
            to="/loja/carrinho"
            className={`menu-item ${isActive("/carrinho") ? "active" : ""}`}
          >
            <ShoppingCart /> Carrinho
          </Link>

          <Link
            to="/loja/pedidos"
            className={`menu-item ${isActive("/pedidos") ? "active" : ""}`}
          >
            <ReceiptText /> Meus Pedidos
          </Link>
        </>
      )}

      {/* --- VISÃO DO ADMIN --- */}
      {isAdmin && (
        <>
          <Link
            to="/loja/admin"
            onClick={handleSavePath("/loja/admin")}
            className={`menu-item ${isActive("/admin") ? "active" : ""}`}
          >
            <UserStar /> Admin
          </Link>

          <Link
            to="/loja/estoque"
            onClick={handleSavePath("/loja/estoque")}
            className={`menu-item ${isActive("/estoque") ? "active" : ""}`}
          >
            <ShelvingUnit /> Estoque
          </Link>
        </>
      )}

      {/* --- ITENS COMUNS (Ambos) --- */}
      <Link
        to="/loja/perfil"
        onClick={handleSavePath("/loja/perfil")}
        className={`menu-item ${isActive("/perfil") ? "active" : ""}`}
      >
        <User /> Perfil
      </Link>

      <button type="button" className="menu-item logout" onClick={handleLogout}>
        <LogOut /> Sair
      </button>
    </nav>
  );
}

LojaMenu.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
