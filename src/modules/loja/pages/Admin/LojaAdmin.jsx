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
} from 'lucide-react';

export default function LojaAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [listaProdutos, listaPedidos] = await Promise.all([
        lojaAPI.getProdutos(),
        lojaAPI.getPedidosTodos(),   // GET /api/pedidos sem filtro
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

  const totalVendido = pedidos
    .filter((p) => p.status === 'PAGO')
    .reduce((sum, p) => sum + (p.valorFinal ?? 0), 0);  // campo correto da API

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

      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

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

          <div className="pedidos-preview">
            {pedidos.length === 0 ? (
              <p className="empty-state">Nenhum pedido encontrado.</p>
            ) : (
              pedidos.slice(0, 5).map((pedido) => (
                <div key={pedido.id} className="pedido-preview">
                  <span className="pedido-id">
                    Pedido #{String(pedido.id).padStart(3, '0')}
                  </span>
                  <span className="pedido-value">
                    R$ {(pedido.valorFinal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`pedido-status ${pedido.status.toLowerCase()}`}>
                    {pedido.status}
                  </span>
                </div>
              ))
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