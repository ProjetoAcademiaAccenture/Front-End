import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../auth/context/AuthContext";
import { lojaAPI } from "../../services/lojaAPI";
import PagamentoPix from "../../components/PagamentoPix/PagamentoPix";
import PagamentoBoleto from "../../components/PagamentoBoleto/PagamentoBoleto";
import PagamentoCartao from "../../components/PagamentoCartao/PagamentoCartao";

import "./LojaPagamento.css";
import { ROUTES } from "../../../../constants";

export default function LojaPagamento() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const { pagamentoConcluido, limparSinalizadorPagamento } =
    useContext(AuthContext);

  const [pedido, setPedido] = useState(null);
  const [metodoSelecionado, setMetodoSelecionado] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        const data = await lojaAPI.getPedidoPorId(pedidoId);
        console.log("Pedido carregado:", data);
        setPedido(data);
        setMetodoSelecionado(data.pagamento?.metodoPagamento);
      } catch (error) {
        setMensagem("Erro ao carregar pedido.");
      }
    };
    carregarPedido();
  }, [pedidoId]);

  useEffect(() => {
    if (
      pedido &&
      pagamentoConcluido?.id === pedido.pagamento.id &&
      pagamentoConcluido?.status === "APROVADO"
    ) {
      setMensagem("Pagamento confirmado com sucesso via Banco!");

      limparSinalizadorPagamento();

      setTimeout(() => {
        navigate(ROUTES.ORDERS);
      }, 5000);
    }
  }, [pagamentoConcluido, pedido, navigate, limparSinalizadorPagamento]);

  const handleFinalizar = async (dadosFilho) => {
    setProcessando(true);
    try {
      // TODO: lógica de pagamento por cartão.
    } catch (error) {
      setMensagem(error.response?.data?.message || "Erro na transação.");
    } finally {
      setProcessando(false);
    }
  };

  if (!pedido) return <div className="p-10">Carregando...</div>;

  return (
    <div className="loja-pagamento-container">
      <h2>Finalizar Pagamento</h2>
      <div className="resumo-pedido">
        <p>
          Pedido: #{pedido.id} | Total:{" "}
          <strong>R$ {pedido.valorFinal.toFixed(2)}</strong>
        </p>
      </div>
      {mensagem && <div className="mensagem">{mensagem}</div>}
      <div className="pagamento-layout">
        <aside className="metodos-selecao">
          {metodoSelecionado === "PIX" && (
            <button
              className={metodoSelecionado === "PIX" ? "active" : ""}
              onClick={() => setMetodoSelecionado("PIX")}
            >
              PIX
            </button>
          )}
          {metodoSelecionado === "BOLETO" && (
            <button
              className={metodoSelecionado === "BOLETO" ? "active" : ""}
              onClick={() => setMetodoSelecionado("BOLETO")}
            >
              BOLETO
            </button>
          )}
          {metodoSelecionado === "CREDITO" && (
            <button
              className={
                ["CREDITO", "DEBITO"].includes(metodoSelecionado)
                  ? "active"
                  : ""
              }
              onClick={() => setMetodoSelecionado("CREDITO")}
            >
              CARTÃO
            </button>
          )}
        </aside>

        <main className="metodo-detalhe">
          {metodoSelecionado === "PIX" && <PagamentoPix pedido={pedido} />}

          {metodoSelecionado === "BOLETO" && (
            <PagamentoBoleto pedido={pedido} />
          )}

          {["CREDITO", "DEBITO"].includes(metodoSelecionado) && (
            <PagamentoCartao
              valorTotal={pedido.valorFinal}
              aoFinalizar={(dados) => {
                setMetodoSelecionado(dados.metodo);
                handleFinalizar(dados);
              }}
              processando={processando}
            />
          )}
        </main>
      </div>
    </div>
  );
}
