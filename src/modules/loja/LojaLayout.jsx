import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LojaHeader from './components/LojaHeader/LojaHeader';
import LojaMenu from './components/LojaMenu/LojaMenu';
import LojaLogin from './pages/Login/LojaLogin';
import LojaCadastro from './pages/Cadastro/LojaCadastro';
import LojaProdutos from './pages/Produtos/LojaProdutos';
import LojaCarrinho from './pages/Carrinho/LojaCarrinho';
import LojaPagamento from './pages/Pagamento/LojaPagamento';
import LojaPedidos from './pages/Pedidos/LojaPedidos';
import LojaEstoque from './pages/Estoque/LojaEstoque';
import LojaAdmin from './pages/Admin/LojaAdmin';
import LojaPerfil from './pages/Perfil/LojaPerfil';
import { useLojaContext } from './hooks/useLojaContext';
import './LojaLayout.css';

function LojaProtectedLayout() {
  const { user } = useContext(AuthContext);
  const { carrinho } = useLojaContext();
  const isAdmin = user?.tipo === 'admin';

  return (
    <div className="loja-layout">
      <LojaHeader
        usuarioNome={user?.nome}
        carrinhoQuantidade={carrinho.length}
      />
      <LojaMenu isAdmin={isAdmin} />
      <div className="loja-content">
        <Routes>
          <Route path="/produtos" element={<LojaProdutos />} />
          <Route path="/carrinho" element={<LojaCarrinho />} />
          <Route path="/pagamento" element={<LojaPagamento />} />
          <Route path="/pedidos" element={<LojaPedidos />} />
          <Route path="/perfil" element={<LojaPerfil />} />
          {isAdmin && (
            <>
              <Route path="/admin" element={<LojaAdmin />} />
              <Route path="/estoque" element={<LojaEstoque />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/loja/produtos" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function LojaLayout() {
  const { isLoggedIn, tabBar } = useContext(AuthContext);

  if (!isLoggedIn || tabBar !== 'loja') {
    return (
      <Routes>
        <Route path="/login" element={<LojaLogin />} />
        <Route path="/signup" element={<LojaCadastro />} />
        <Route path="*" element={<Navigate to="/loja/login" />} />
      </Routes>
    );
  }

  return <LojaProtectedLayout />;
}
