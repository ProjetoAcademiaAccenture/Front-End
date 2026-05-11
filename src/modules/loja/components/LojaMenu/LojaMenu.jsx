import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";

import "./LojaMenu.css";
import { LogOut,User,ShelvingUnit,PackageOpen,ShoppingCart,ReceiptText,UserStar } from 'lucide-react';

export default function LojaMenu({ isAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useModuleAuth("loja");
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

      {isAdmin && (
        <>
          <Link
            to="/loja/admin"
            className={`menu-item ${isActive("/admin") ? "active" : ""}`}
          >
            <UserStar /> Admin
          </Link>

          <Link
            to="/loja/estoque"
            className={`menu-item ${isActive("/estoque") ? "active" : ""}`}
          >
            <ShelvingUnit /> Estoque
          </Link>
        </>
      )}

      <Link
        to="/loja/perfil"
        className={`menu-item ${isActive("/perfil") ? "active" : ""}`}
      >
        <User /> Perfil
      </Link>

      <button type="button" className="menu-item logout" onClick={handleLogout}>
        🚪 Sair
      </button>
    </nav>
  );
}
