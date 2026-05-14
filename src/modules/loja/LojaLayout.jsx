import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";

import LojaHeader from "./components/LojaHeader/LojaHeader";
import LojaMenu from "./components/LojaMenu/LojaMenu";

import LojaLogin from "./pages/Login/LojaLogin";
import LojaCadastro from "./pages/Cadastro/LojaCadastro";

import LojaProdutos from "./pages/Produtos/LojaProdutos";
import LojaCarrinho from "./pages/Carrinho/LojaCarrinho";
import LojaPagamento from "./pages/Pagamento/LojaPagamento";
import LojaPedidos from "./pages/Pedidos/LojaPedidos";
import LojaPerfil from "./pages/Perfil/LojaPerfil";
import LojaAdmin from "./pages/Admin/LojaAdmin";
import LojaEstoque from "./pages/Estoque/LojaEstoque";

import { useLojaContext } from "./hooks/useLojaContext";
import { useModuleAuth } from "../../auth/hooks/useModuleAuth";
import { usePathTracker } from "../../auth/hooks/usePathTracker";

import "./LojaLayout.css";

export default function LojaLayout() {
  const { carrinho } = useLojaContext();
  const { user, isAuthenticated } = useModuleAuth("loja");
  const { saveLastPath } = useContext(AuthContext);

  usePathTracker("loja", saveLastPath);

  const isAdmin = user?.tipoCliente === "ROLE_ADMIN";

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="login" element={<LojaLogin />} />
        <Route path="signup" element={<LojaCadastro />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="loja-layout">
      <LojaHeader
        usuarioNome={user?.nome}
        carrinhoQuantidade={carrinho?.length ?? 0}
      />

      <LojaMenu isAdmin={isAdmin} />

      <div className="loja-content">
        <Routes>
          <Route path="produtos" element={<LojaProdutos />} />
          <Route path="carrinho" element={<LojaCarrinho />} />
          <Route path="pagamento/:pedidoId" element={<LojaPagamento />} />
          <Route path="pedidos" element={<LojaPedidos />} />
          <Route path="perfil" element={<LojaPerfil />} />

          {isAdmin && (
            <>
              <Route path="admin" element={<LojaAdmin />} />
              <Route path="estoque" element={<LojaEstoque />} />
            </>
          )}

          <Route path="*" element={<Navigate to="produtos" replace />} />
        </Routes>
      </div>
    </div>
  );
}
