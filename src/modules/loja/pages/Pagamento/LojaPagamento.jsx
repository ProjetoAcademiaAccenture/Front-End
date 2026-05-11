import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLojaContext } from "../../hooks/useLojaContext";
import { useBanco } from "../../../banco/hooks/useBanco";
import { BancoContext } from "../../../../context/BancoContext";
import { lojaAPI } from "../../services/lojaAPI";
import "./LojaPagamento.css";
import { Wallet,CreditCard,BanknoteArrowUp,SquareSplitHorizontal } from 'lucide-react';
import { RiPixLine } from "react-icons/ri";

export default function LojaPagamento() {
  const navigate = useNavigate();
  const { carrinho, calcularTotal, finalizarPedido, criarPedido } =
    useLojaContext();
  const { processarPagamento } = useBanco();
  const { saldo } = useContext(BancoContext);
  const [metodo, setMetodo] = useState("banco");
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const total = calcularTotal();
  const desconto = total > 1000 ? total * 0.1 : 0;
  const totalComDesconto = total - desconto;

  if (carrinho.length === 0) {
    return (
      <div className="loja-page">
        <div className="page-header">
          <h1><Wallet /> Pagamento</h1>
        </div>
        <div className="empty-state">
          <p>Seu carrinho está vazio</p>
          <button onClick={() => navigate("/loja/produtos")}>
            Voltar aos Produtos
          </button>
        </div>
      </div>
    );
  }

  const handlePagamento = async (e) => {
    e.preventDefault();
    setProcessando(true);
    setMensagem("");

    try {
      if (metodo === "banco") {
        if (saldo < totalComDesconto) {
          setMensagem("Saldo insuficiente no banco");
          setProcessando(false);
          return;
        }

        const sucesso = processarPagamento(
          totalComDesconto,
          "Compra na Loja Online",
        );
        if (sucesso) {
          const pedido = criarPedido({
            itens: carrinho,
            total: totalComDesconto,
            desconto,
            metodo: "banco",
          });

          finalizarPedido(pedido.id);
          setMensagem("Pagamento realizado com sucesso!");

          setTimeout(() => {
            navigate("/loja/pedidos");
          }, 2000);
        } else {
          setMensagem("Erro ao processar pagamento");
        }
      } else {
        const resultado = await lojaAPI.processarPagamento(totalComDesconto);
        if (resultado.success) {
          const pedido = criarPedido({
            itens: carrinho,
            total: totalComDesconto,
            desconto,
            metodo,
            transacaoId: resultado.transacaoId,
          });

          finalizarPedido(pedido.id);
          setMensagem("Pagamento realizado com sucesso!");

          setTimeout(() => {
            navigate("/loja/pedidos");
          }, 2000);
        } else {
          setMensagem("Erro ao processar pagamento");
        }
      }
    } catch (err) {
      setMensagem("Erro ao processar pagamento: " + err.message);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1><Wallet /> Pagamento</h1>
        <p className="page-subtitle">Finalize sua compra com segurança</p>
      </div>

      {mensagem && (
        <div
          className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}
        >
          {mensagem}
        </div>
      )}

      <div className="pagamento-container">
        <div className="pagamento-form">
          <h2>Método de Pagamento</h2>

          <form onSubmit={handlePagamento}>
            <div className="metodos">
              <label className="metodo-option">
                <input
                  type="radio"
                  name="metodo"
                  value="banco"
                  checked={metodo === "banco"}
                  onChange={(e) => setMetodo(e.target.value)}
                  disabled={processando}
                />
                <span><BanknoteArrowUp /> Débito Bancário</span>
                <small>
                  Saldo disponível: R${" "}
                  {(saldo ?? 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </small>
              </label>

              <label className="metodo-option">
                <input
                  type="radio"
                  name="metodo"
                  value="credito"
                  checked={metodo === "credito"}
                  onChange={(e) => setMetodo(e.target.value)}
                  disabled={processando}
                />
                <span><CreditCard /> Cartão de Crédito</span>
                <small>Parcelado em até 12x</small>
              </label>

              <label className="metodo-option">
                <input
                  type="radio"
                  name="metodo"
                  value="pix"
                  checked={metodo === "pix"}
                  onChange={(e) => setMetodo(e.target.value)}
                  disabled={processando}
                />
                <span><RiPixLine size={24}/> PIX</span>
                <small>Pagamento instantâneo</small>
              </label>

              <label className="metodo-option">
                <input
                  type="radio"
                  name="metodo"
                  value="boleto"
                  checked={metodo === "boleto"}
                  onChange={(e) => setMetodo(e.target.value)}
                  disabled={processando}
                />
                <span><SquareSplitHorizontal /> Boleto Bancário</span>
                <small>Vencimento em 3 dias</small>
              </label>
            </div>

            <div className="pagamento-info">
              <h3>Informações de Segurança</h3>
              <ul>
                <li>✓ Conexão criptografada com SSL</li>
                <li>✓ Seu pagamento é 100% seguro</li>
                <li>✓ Dados não são armazenados</li>
                <li>✓ Garantia de reembolso se necessário</li>
              </ul>
            </div>

            <button type="submit" className="btn-pagar" disabled={processando}>
              {processando
                ? "Processando..."
                : `💳 Pagar R$ ${totalComDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </button>
          </form>
        </div>

        <div className="pagamento-resumo">
          <h2>Resumo da Compra</h2>

          <div className="resumo-itens">
            {carrinho.map((item) => (
              <div key={item.id} className="item-resumo">
                <span>
                  {item.nome} x{item.quantidade}
                </span>
                <span>
                  R${" "}
                  {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>

          <div className="resumo-totais">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {desconto > 0 && (
              <div className="total-line desconto">
                <span>Desconto:</span>
                <span>
                  -R${" "}
                  {desconto.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <div className="total-line frete">
              <span>Frete:</span>
              <span>Grátis</span>
            </div>

            <div className="total-line total">
              <span>Total:</span>
              <span>
                R${" "}
                {totalComDesconto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <button
            className="btn-voltar"
            onClick={() => navigate("/loja/carrinho")}
            disabled={processando}
          >
            Voltar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
