import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lojaAPI } from "../../services/lojaAPI";
import { BancoContext } from "../../../banco/context/BancoContext";
import PagamentoPix from "../../components/PagamentoPix/PagamentoPix";
import PagamentoBoleto from "../../components/PagamentoBoleto/PagamentoBoleto";
import PagamentoCartao from "../../components/PagamentoCartao/PagamentoCartao";
import { ROUTES } from "../../../../constants";

export default function LojaPagamento() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
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

  const handleFinalizar = async (dadosFilho) => {
    setProcessando(true);
    try {
      const payload = {
        pagamentoId: pedido.pagamento.id,
        metodoPagamento: metodoSelecionado,
        senhaTransacao: dadosFilho.senhaTransacao,
      };

      console.log("Payload enviado para processamento:", payload);
      const response = await lojaAPI.processarPagamento(payload);
      console.log("Resposta do processamento:", response);
      if (response.status === "RECUSADO") {
        setMensagem("Pagamento recusado.");
      } else if (response.status === "APROVADO") {
        setMensagem("Pagamento realizado com sucesso!");
        navigate(ROUTES.PRODUCTS);
      } else if (metodoSelecionado === "BOLETO") {
        setMensagem("Boleto gerado com sucesso!");
        const atualizado = await lojaAPI.getPedidoPorId(pedidoId);
        setPedido(atualizado);
      }
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
          {metodoSelecionado === "PIX" && (
            <PagamentoPix
              pedido={pedido}
              aoFinalizar={handleFinalizar}
              processando={processando}
            />
          )}

          {metodoSelecionado === "BOLETO" && (
            <PagamentoBoleto
              pedido={pedido}
              aoFinalizar={handleFinalizar}
              processando={processando}
            />
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
