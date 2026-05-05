import React from 'react';
import { useLojaContext } from '../../hooks/useLojaContext';
import './LojaPedidos.css';

export default function LojaPedidos() {
  const { pedidos } = useLojaContext();

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>📋 Meus Pedidos</h1>
        <p className="page-subtitle">Histórico de compras e status</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não fez nenhuma compra</p>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <h3>Pedido #{String(pedido.id).padStart(3, '0')}</h3>
                  <p className="pedido-data">{pedido.data}</p>
                </div>
                <span className={`badge badge-${pedido.status.toLowerCase()}`}>
                  {pedido.status}
                </span>
              </div>

              <div className="pedido-items">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="pedido-item">
                    <span>{item.nome} x{item.quantidade}</span>
                    <span>
                      R$ {(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pedido-totals">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>
                    R$ {pedido.itens
                      .reduce((sum, item) => sum + item.preco * item.quantidade, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {pedido.desconto > 0 && (
                  <div className="total-line desconto">
                    <span>Desconto:</span>
                    <span>-R$ {pedido.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="total-line total">
                  <span>Total:</span>
                  <span>R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pedido-actions">
                <button className="btn-detalhes">Ver Detalhes</button>
                <button className="btn-rastrear">Rastrear Pedido</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
