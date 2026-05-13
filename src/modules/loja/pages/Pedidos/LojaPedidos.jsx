import { useState, useEffect } from "react";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { lojaAPI } from "../../services/lojaAPI";

import "./LojaPedidos.css";

export default function LojaPedidos() {
  const { user } = useModuleAuth("loja");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificacao, setNotificacao] = useState("");
  const [pedidoCancelando, setPedidoCancelando] = useState(null);
  const [filtroSelecionado, setFiltroSelecionado] = useState("TODOS");

  const filtros = ["TODOS", "RESERVADO", "APROVADO", "CANCELADO"];
  const pedidosFiltrados =
    filtroSelecionado === "TODOS"
      ? pedidos
      : pedidos.filter((p) => p.status === filtroSelecionado);

  useEffect(() => {
    if (!user?.clienteId) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await lojaAPI.getPedidos(user.clienteId);
        console.log("Pedidos recebidos:", response);
        setPedidos(response);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user?.clienteId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const atualizarPedidoParaCancelado = (pedidoId) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: "CANCELADO" } : pedido,
      ),
    );
  };

  const finalizarCancelamento = (pedidoId) => {
    setNotificacao("");
    setPedidoCancelando(null);
    atualizarPedidoParaCancelado(pedidoId);
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      try {
        const response = await lojaAPI.cancelarPedido(pedidoId);
        console.log("Resposta do cancelamento:", response);
        if (response.status === 200) {
          setPedidoCancelando(pedidoId);
          setNotificacao("Pedido cancelado com sucesso!");
          setTimeout(() => {
            finalizarCancelamento(pedidoId);
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao cancelar pedido:", error);
        setNotificacao("Houve um erro ao cancelar o pedido. Tente novamente.");
        setPedidoCancelando(pedidoId);
      }
    }
  };

  if (loading)
    return (
      <div className="loja-page">
        <p>Carregando seus pedidos...</p>
      </div>
    );

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>📋 Meus Pedidos</h1>
        <p className="page-subtitle">Histórico de compras e status</p>
      </div>
      <div className="filtros-container">
        <div className="filtros">
          {filtros.map((filtro) => (
            <button
              key={filtro}
              className={`filtro-btn ${filtroSelecionado === filtro ? "active" : ""}`}
              onClick={() => setFiltroSelecionado(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não fez nenhuma compra</p>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              {notificacao && pedido.id === pedidoCancelando && (
                <div className="notification">{notificacao}</div>
              )}

              <div className="pedido-header">
                <div>
                  <h3>Pedido #{String(pedido.id).padStart(3, "0")}</h3>
                  <p className="pedido-data">
                    {formatDate(pedido.dataCriacao)}
                  </p>
                </div>
                <span className={`badge badge-${pedido.status.toLowerCase()}`}>
                  {pedido.status}
                </span>
              </div>

              <div className="pedido-items">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="pedido-item">
                    <span>
                      {item.produtoNome || "Produto"} x{item.quantidade}
                    </span>
                    <span>
                      R${" "}
                      {(item.precoUnitario * item.quantidade).toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pedido-totals">
                <div className="total-line">
                  <span>Subtotal (Bruto):</span>
                  <span>
                    R${" "}
                    {pedido.valorBruto.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {pedido.desconto > 0 && (
                  <div className="total-line desconto">
                    <span>Desconto ({pedido.pagamento?.metodoPagamento}):</span>
                    <span>
                      - R${" "}
                      {pedido.desconto.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                <div className="total-line total">
                  <span>Total Pago:</span>
                  <span>
                    R${" "}
                    {pedido.valorFinal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <p className="pagamento-metodo">
                  Método: <strong>{pedido.pagamento?.metodoPagamento}</strong>(
                  {` ${pedido.pagamento?.status} `})
                </p>
              </div>

              <div className="pedido-actions">
                <button className="btn-detalhes">Ver Detalhes</button>
                {pedido.status !== "CANCELADO" && (
                  <button
                    className="btn-cancelar"
                    onClick={() => handleCancelarPedido(pedido.id)}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
