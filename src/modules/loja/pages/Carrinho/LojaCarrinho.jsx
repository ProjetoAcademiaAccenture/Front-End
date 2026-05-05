import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLojaContext } from '../../hooks/useLojaContext';
import CarrinhoItem from '../../components/CarrinhoItem/CarrinhoItem';
import './LojaCarrinho.css';

export default function LojaCarrinho() {
  const navigate = useNavigate();
  const { carrinho, removerDoCarrinho, atualizarQuantidadeCarrinho, calcularTotal } = useLojaContext();

  const total = calcularTotal();
  const desconto = total > 1000 ? total * 0.1 : 0;
  const totalComDesconto = total - desconto;

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>🛒 Carrinho de Compras</h1>
        <p className="page-subtitle">{carrinho.length} item{carrinho.length !== 1 ? 's' : ''} no carrinho</p>
      </div>

      <div className="carrinho-container">
        <div className="carrinho-items">
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio">
              <p>😕 Seu carrinho está vazio</p>
              <button
                className="btn-continuar-comprando"
                onClick={() => navigate('/loja/produtos')}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {carrinho.map((item) => (
                <CarrinhoItem
                  key={item.id}
                  item={item}
                  onQuantidadeChange={atualizarQuantidadeCarrinho}
                  onRemove={removerDoCarrinho}
                />
              ))}
            </>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="carrinho-resumo">
            <h2>Resumo do Pedido</h2>

            <div className="resumo-item">
              <span>Subtotal:</span>
              <span>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {desconto > 0 && (
              <>
                <div className="resumo-item desconto">
                  <span>Desconto (10%):</span>
                  <span>
                    -R$ {desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="info-desconto">
                  ✓ Desconto aplicado para compras acima de R$ 1.000
                </div>
              </>
            )}

            <div className="resumo-item frete">
              <span>Frete:</span>
              <span>Grátis</span>
            </div>

            <div className="divisor"></div>

            <div className="resumo-total">
              <span>Total:</span>
              <span>
                R$ {totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              className="btn-finalizar"
              onClick={() => navigate('/loja/pagamento')}
            >
              💳 Finalizar Compra
            </button>

            <button
              className="btn-continuar"
              onClick={() => navigate('/loja/produtos')}
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
