import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BancoHeader from './components/BancoHeader/BancoHeader';
import BancoMenu from './components/BancoMenu/BancoMenu';
import BancoLogin from './pages/Login/BancoLogin';
import BancoCadastro from './pages/Cadastro/BancoCadastro';
import BancoDashboard from './pages/Dashboard/BancoDashboard';
import BancoTransacoes from './pages/Transacoes/BancoTransacoes';
import BancoDeposito from './pages/Deposito/BancoDeposito';
import BancoPerfil from './pages/Perfil/BancoPerfil';
import { useBanco } from './hooks/useBanco';
import './BancoLayout.css';

function BancoProtectedLayout() {
  const { user } = useContext(AuthContext);
  const { saldo } = useBanco();

  return (
    <div className="banco-layout">
      <BancoHeader saldo={saldo} usuarioNome={user?.nome} />
      <BancoMenu />
      <div className="banco-content">
        <Routes>
          <Route path="/dashboard" element={<BancoDashboard />} />
          <Route path="/transacoes" element={<BancoTransacoes />} />
          <Route path="/deposito" element={<BancoDeposito />} />
          <Route path="/perfil" element={<BancoPerfil />} />
          <Route path="*" element={<Navigate to="/banco/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function BancoLayout() {
  const { isLoggedIn, userType } = useContext(AuthContext);

  if (!isLoggedIn || userType !== 'banco') {
    return (
      <Routes>
        <Route path="/login" element={<BancoLogin />} />
        <Route path="/signup" element={<BancoCadastro />} />
        <Route path="*" element={<Navigate to="/banco/login" />} />
      </Routes>
    );
  }

  return <BancoProtectedLayout />;
}
