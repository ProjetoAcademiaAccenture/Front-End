import React, { useState, useEffect, useCallback } from 'react';
import { lojaAPI } from '../../services/lojaAPI';
import './LojaAdmin.css';

import {
  UserCog,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export default function LojaAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [cancelando, setCancelando] = useState(null); // id do pedido em cancelamento

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [listaProdutos, listaPedidos] = await Promise.all([
        lojaAPI.getProdutos(),
        lojaAPI.getPedidosTodos(),
      ]);
      setProdutos(listaProdutos);
      setPedidos(listaPedidos);
    } catch (err) {
      setErro('Erro ao carregar dados. Verifique a conexão com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const mostrarMensagem = (msg) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), 3000);
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm(`Deseja cancelar o pedido #${String(pedidoId).padStart(3, '0')}?`)) return;
    setCancelando(pedidoId);
    setErro('');
    try {
      await lojaAPI.cancelarPedido(pedidoId);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, status: 'CANCELADO' } : p))
      );
      mostrarMensagem(`Pedido #${String(pedidoId).padStart(3, '0')} cancelado.`);
    } catch (err) {
      setErro('Erro ao cancelar pedido.');
      console.error(err);
    } finally {
      setCancelando(null);
    }
  };

  const totalVendido = pedidos
    .filter((p) => p.status === 'PAGO')
    .reduce((sum, p) => sum + (p.valorFinal ?? 0), 0);

  const produtosMaisBaixa = [...produtos]
    .sort((a, b) => a.quantidadeEstoque - b.quantidadeEstoque)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="loja-page">
        <div className="loading-state">
          <RefreshCw size={24} className="spin" /> Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="loja-page">

      <div className="page-header">
        <div>
          <h1><UserCog size={22} /> Painel Administrativo</h1>
          <p className="page-subtitle">Dashboard de vendas e gerenciamento</p>
        </div>
        <button className="btn-refresh" onClick={carregarDados} title="Recarregar">
          <RefreshCw size={16} />
        </button>
      </div>

      {mensagem && <div className="alerta-sucesso">✓ {mensagem}</div>}
      {erro && <div className="alerta-erro">⚠ {erro}</div>}

      <div className="admin-stats">

        <div className="stat-card">
          <h3><DollarSign size={18} /> Faturamento Total</h3>
          <p className="valor">
            R$ {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="stat-card">
          <h3><ShoppingCart size={18} /> Pedidos</h3>
          <p className="valor">{pedidos.length}</p>
        </div>

        <div className="stat-card">
          <h3><Package size={18} /> Produtos</h3>
          <p className="valor">{produtos.length}</p>
        </div>

        <div className="stat-card">
          <h3><BarChart3 size={18} /> Estoque Total</h3>
          <p className="valor">
            {produtos.reduce((sum, p) => sum + (p.quantidadeEstoque ?? 0), 0)} unidades
          </p>
        </div>

      </div>

      <div className="admin-content">

        <div className="admin-section">
          <h2><AlertTriangle size={18} /> Produtos com Baixo Estoque</h2>

          <div className="table-scroll">
            {produtosMaisBaixa.length === 0 ? (
              <p className="empty-state">Nenhum produto encontrado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Estoque</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosMaisBaixa.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>
                        <span
                          className={
                            p.quantidadeEstoque === 0
                              ? 'fora'
                              : p.quantidadeEstoque <= 5
                              ? 'baixo'
                              : 'ok'
                          }
                        >
                          {p.quantidadeEstoque}
                        </span>
                      </td>
                      <td>
                        R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="admin-section">
          <h2><FileText size={18} /> Últimos Pedidos</h2>

          <div className="table-scroll">
            {pedidos.length === 0 ? (
              <p className="empty-state">Nenhum pedido encontrado.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{String(pedido.id).padStart(3, '0')}</td>
                      <td>
                        R$ {(pedido.valorFinal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`pedido-status ${pedido.status.toLowerCase()}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td>
                        {pedido.status !== 'CANCELADO' && (
                          <button
                            className="btn-deletar"
                            title="Cancelar pedido"
                            disabled={cancelando === pedido.id}
                            onClick={() => handleCancelarPedido(pedido.id)}
                          >
                            <XCircle size={14} />
                            {cancelando === pedido.id ? ' Cancelando...' : ' Cancelar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      <div className="admin-actions">
        <button className="btn-admin">
          <FileText size={16} /> Relatório Completo
        </button>
        <button className="btn-admin">
          <BarChart3 size={16} /> Análise de Vendas
        </button>
        <button className="btn-admin">
          <Settings size={16} /> Configurações
        </button>
      </div>

    </div>
  );
}