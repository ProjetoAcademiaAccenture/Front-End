import React, { useState, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { ROUTES } from "../constants";

// Banco Components
import BancoHeader from "../modules/banco/components/BancoHeader/BancoHeader";
import BancoMenu from "../modules/banco/components/BancoMenu/BancoMenu";
import BancoLogin from "../modules/banco/pages/Login/BancoLogin";
import BancoCadastro from "../modules/banco/pages/Cadastro/BancoCadastro";
import BancoDashboard from "../modules/banco/pages/Dashboard/BancoDashboard";
import BancoTransacoes from "../modules/banco/pages/Transacoes/BancoTransacoes";
import BancoDeposito from "../modules/banco/pages/Deposito/BancoDeposito";
import BancoPerfil from "../modules/banco/pages/Perfil/BancoPerfil";
import { useBanco } from "../modules/banco/hooks/useBanco";

// Loja Components
import LojaHeader from "../modules/loja/components/LojaHeader/LojaHeader";
import LojaMenu from "../modules/loja/components/LojaMenu/LojaMenu";
import LojaLogin from "../modules/loja/pages/Login/LojaLogin";
import LojaCadastro from "../modules/loja/pages/Cadastro/LojaCadastro";
import LojaProdutos from "../modules/loja/pages/Produtos/LojaProdutos";
import LojaCarrinho from "../modules/loja/pages/Carrinho/LojaCarrinho";
import LojaPagamento from "../modules/loja/pages/Pagamento/LojaPagamento";
import LojaPedidos from "../modules/loja/pages/Pedidos/LojaPedidos";
import LojaEstoque from "../modules/loja/pages/Estoque/LojaEstoque";
import LojaAdmin from "../modules/loja/pages/Admin/LojaAdmin";
import LojaPerfil from "../modules/loja/pages/Perfil/LojaPerfil";
import { useLojaContext } from "../modules/loja/hooks/useLojaContext";

import "./BrowserWindow.css";

function BancoProtectedLayout() {
  const { user } = useContext(AuthContext);
  const { saldo } = useBanco();

  return (
    <div className="module-layout">
      <BancoHeader usuarioNome={user?.nome} saldo={saldo} />
      <BancoMenu />
      <div className="module-content">
        <Routes>
          <Route path="dashboard" element={<BancoDashboard />} />
          <Route path="transacoes" element={<BancoTransacoes />} />
          <Route path="deposito" element={<BancoDeposito />} />
          <Route path="perfil" element={<BancoPerfil />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

function BancoModuleRouter() {
  const { isLoggedIn, tabBar } = useContext(AuthContext);

  if (!isLoggedIn || tabBar !== "banco") {
    return (
      <Routes>
        <Route path="login" element={<BancoLogin />} />
        <Route path="signup" element={<BancoCadastro />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    );
  }

  return <BancoProtectedLayout />;
}

function LojaProtectedLayout() {
  const { user } = useContext(AuthContext);
  const { carrinho } = useLojaContext();
  const isAdmin = user?.tipo === "admin";

  return (
    <div className="module-layout">
      <LojaHeader
        usuarioNome={user?.nome}
        carrinhoQuantidade={carrinho.length}
      />
      <LojaMenu isAdmin={isAdmin} />
      <div className="module-content">
        <Routes>
          <Route path="produtos" element={<LojaProdutos />} />
          <Route path="carrinho" element={<LojaCarrinho />} />
          <Route path="pagamento" element={<LojaPagamento />} />
          <Route path="pedidos" element={<LojaPedidos />} />
          <Route path="perfil" element={<LojaPerfil />} />
          {isAdmin && (
            <>
              <Route path="admin" element={<LojaAdmin />} />
              <Route path="estoque" element={<LojaEstoque />} />
            </>
          )}
          <Route path="*" element={<Navigate to="produtos" />} />
        </Routes>
      </div>
    </div>
  );
}

function LojaModuleRouter() {
  const { isLoggedIn, tabBar } = useContext(AuthContext);

  if (!isLoggedIn || tabBar !== "loja") {
    return (
      <Routes>
        <Route path="login" element={<LojaLogin />} />
        <Route path="signup" element={<LojaCadastro />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    );
  }

  return <LojaProtectedLayout />;
}

export default function BrowserWindow() {
  const [activeTab, setActiveTab] = useState("loja");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    logout();
    if (tab === "loja") {
      navigate(ROUTES.LOGIN_SHOP);
    } else {
      navigate(ROUTES.LOGIN_BANK);
    }
  };

  return (
    <div className="desktop">
      <div className="pc-window">
        {/* Titlebar */}
        <div className="titlebar">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
          <span className="titlebar-text">E-Commerce System</span>
        </div>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "loja" ? "active" : ""}`}
            onClick={() => handleTabSwitch("loja")}
            type="button"
          >
            <span className="tab-favicon loja" />
            <span>🛍️ Loja Online</span>
          </button>
          <button
            className={`tab ${activeTab === "banco" ? "active" : ""}`}
            onClick={() => handleTabSwitch("banco")}
            type="button"
          >
            <span className="tab-favicon banco" />
            <span>🏦 Banco Digital</span>
          </button>
        </div>

        {/* Address Bar */}
        <div className="address-bar">
          <span className="address-icon">🔒</span>
          <div className="address-input">
            {activeTab === "loja"
              ? "lojaapp.local/produtos"
              : "banco.digital/dashboard"}
          </div>
        </div>

        {/* Browser Content */}
        <div className="browser-content">
          <Routes>
            <Route path="/loja/*" element={<LojaModuleRouter />} />
            <Route path="/banco/*" element={<BancoModuleRouter />} />
            <Route
              path="*"
              element={
                activeTab === "loja" ? (
                  <Navigate to={ROUTES.LOGIN_SHOP} />
                ) : (
                  <Navigate to={ROUTES.LOGIN_BANK} />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
