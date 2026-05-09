import { Routes, Route, Navigate } from "react-router-dom";
import BancoHeader from "./components/BancoHeader/BancoHeader";
import BancoMenu from "./components/BancoMenu/BancoMenu";
import BancoLogin from "./pages/Login/BancoLogin";
import BancoCadastro from "./pages/Cadastro/BancoCadastro";
import BancoDashboard from "./pages/Dashboard/BancoDashboard";
import BancoTransacoes from "./pages/Transacoes/BancoTransacoes";
import BancoDeposito from "./pages/Deposito/BancoDeposito";
import BancoPerfil from "./pages/Perfil/BancoPerfil";
import { useModuleAuth } from "../../auth/hooks/useModuleAuth";

import "./BancoLayout.css";

export default function BancoLayout() {
  const { user, isAuthenticated } = useModuleAuth("banco");

  const isAdmin = user?.tipoCliente === "ROLE_ADMIN";

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="login" element={<BancoLogin />} />
        <Route path="signup" element={<BancoCadastro />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="banco-layout">
      <BancoHeader usuarioNome={user?.nome} />
      <BancoMenu isAdmin={isAdmin} />

      <div className="banco-content">
        <Routes>
          <Route path="dashboard" element={<BancoDashboard />} />
          <Route path="transacoes" element={<BancoTransacoes />} />
          <Route path="deposito" element={<BancoDeposito />} />
          <Route path="perfil" element={<BancoPerfil />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
