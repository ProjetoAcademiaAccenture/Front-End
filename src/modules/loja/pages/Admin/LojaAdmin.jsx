import React from 'react';
import { useLojaContext } from '../../hooks/useLojaContext';
import './LojaAdmin.css';

export default function LojaAdmin() {
  const { produtos, pedidos } = useLojaContext();

  const totalVendido = pedidos
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.total, 0);

  const produtosMaisBaixa = produtos.sort((a, b) => a.estoque - b.estoque).slice(0, 5);

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>👨‍💼 Painel Administrativo</h1>
        <p className="page-subtitle">Dashboard de vendas e gerenciamento</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Faturamento Total</h3>
          <p className="valor">
            R$ {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="stat-card">
          <h3>Pedidos</h3>
          <p className="valor">{pedidos.length}</p>
        </div>

        <div className="stat-card">
          <h3>Produtos</h3>
          <p className="valor">{produtos.length}</p>
        </div>

        <div className="stat-card">
          <h3>Estoque Total</h3>
          <p className="valor">
            {produtos.reduce((sum, p) => sum + p.estoque, 0)} unidades
          </p>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-section">
          <h2>📦 Produtos com Baixo Estoque</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Produto</th>
                  <th>Estoque</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                {produtosMaisBaixa.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.nome}</td>
                    <td>
                      <span className={p.estoque === 0 ? 'fora' : p.estoque <= 5 ? 'baixo' : 'ok'}>
                        {p.estoque}
                      </span>
                    </td>
                    <td>R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>💰 Últimos Pedidos</h2>
          <div className="pedidos-preview">
            {pedidos.slice(0, 5).map((pedido) => (
              <div key={pedido.id} className="pedido-preview">
                <span className="pedido-id">Pedido #{String(pedido.id).padStart(3, '0')}</span>
                <span className="pedido-value">
                  R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={`pedido-status ${pedido.status.toLowerCase()}`}>
                  {pedido.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button className="btn-admin">📋 Relatório Completo</button>
        <button className="btn-admin">📊 Análise de Vendas</button>
        <button className="btn-admin">📱 Configurações</button>
      </div>
    </div>
  );
}
