import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLojaContext } from "../../hooks/useLojaContext";
import CarrinhoItem from "../../components/CarrinhoItem/CarrinhoItem";
import "./LojaCarrinho.css";
import { lojaAPI } from "../../services/lojaAPI";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { PAYMENT_METHODS, ROUTES } from "../../../../constants";

export default function LojaCarrinho() {
  const navigate = useNavigate();
  const { user } = useModuleAuth("loja");
  const {
    carrinho,
    removerDoCarrinho,
    atualizarQuantidadeCarrinho,
    calcularTotal,
    esvazearCarrinho,
  } = useLojaContext();

  const [metodoPagamento, setMetodoPagamento] = React.useState("PIX");
  const [notificacao, setNotificacao] = useState("");

  const total = calcularTotal();
  const desconto = total > 1000 ? total * 0.1 : 0;
  const totalComDesconto = total - desconto;

  const handleFinalizarPedido = async () => {
    if (!user?.clienteId) return;
    if (carrinho.length !== 0) {
      const pedido = {
        clienteId: user?.clienteId,
        metodoPagamento: metodoPagamento,
        itens: carrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
      };
      const resultado = await lojaAPI.finalizarPedido(pedido);
      if (resultado.status === 201) {
        console.log("Pedido finalizado:", resultado.data);
        setNotificacao("Pedido finalizado com sucesso!");
        setTimeout(() => {
          setNotificacao("");
          const carrinhoKey = `loja_carrinho_user_${user.clienteId}`;
          localStorage.removeItem(carrinhoKey);
          esvazearCarrinho();
          navigate(ROUTES.ORDERS);
        }, 3000);
      } else {
        alert("Houve um erro ao finalizar o pedido. Tente novamente.");
      }
    }
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>🛒 Carrinho de Compras</h1>
        <p className="page-subtitle">
          {carrinho.length} item{carrinho.length === 1 ? "" : "s"} no carrinho
        </p>
      </div>

      {notificacao && <div className="notification">✓ {notificacao}</div>}

      <div className="carrinho-container">
        <div className="carrinho-items">
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio">
              <p>😕 Seu carrinho está vazio</p>
              <button
                className="btn-continuar-comprando"
                onClick={() => navigate("/loja/produtos")}
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
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {desconto > 0 && (
              <>
                <div className="resumo-item desconto">
                  <span>Desconto (10%):</span>
                  <span>
                    -R${" "}
                    {desconto.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
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

            <div className="resumo-item">
              <label htmlFor="metodoPagamento">Método de Pagamento</label>
              <select
                id="metodoPagamento"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="input-field"
              >
                {Object.values(PAYMENT_METHODS).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="divisor"></div>

            <div className="resumo-total">
              <span>Total:</span>
              <span>
                R${" "}
                {totalComDesconto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <button className="btn-finalizar" onClick={handleFinalizarPedido}>
              Finalizar Pedido
            </button>

            <button
              className="btn-continuar"
              onClick={() => navigate("/loja/produtos")}
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
